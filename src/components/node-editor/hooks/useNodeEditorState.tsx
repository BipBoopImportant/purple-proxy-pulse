import { useState, useCallback, useRef } from 'react';
import { 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Connection, 
  MarkerType,
  useReactFlow
} from '@xyflow/react';
import { useToast } from "@/components/ui/use-toast";
import { CustomNode, CustomEdge, NodeTypes } from '../NodeTypes';
import { generateScript, generateExecutableScript } from '../utils/codeGenerator';

interface UseNodeEditorStateProps {
  onScriptSave?: (scriptName: string, script: string, nodes: CustomNode[], edges: CustomEdge[]) => void;
  onScriptRun?: (script: string) => void;
}

const useNodeEditorState = ({ onScriptSave, onScriptRun }: UseNodeEditorStateProps) => {
  const { toast } = useToast();
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge[]>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [scriptName, setScriptName] = useState('My Selenium Script');
  const [generatedCode, setGeneratedCode] = useState('');
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Initialize with a start node
  const initializeEditor = useCallback(() => {
    if (nodes.length === 0) {
      const startNode: CustomNode = {
        id: 'start-node',
        type: NodeTypes.START,
        position: { x: 250, y: 50 },
        data: { label: 'Start', type: NodeTypes.START }
      };
      
      setNodes([startNode]);
    }
  }, [nodes.length, setNodes]);

  // Handle node data changes
  const onNodeDataChange = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
              onChange: onNodeDataChange
            }
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}`,
        animated: true,
        style: { stroke: '#9F7AEA' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#9F7AEA',
        }
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Handle drag over
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle node drop
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const nodeType = event.dataTransfer.getData('application/reactflow') as NodeTypes;
      if (!nodeType) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });
      
      const newNode: CustomNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: { 
          label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1),
          type: nodeType,
          onChange: onNodeDataChange
        }
      };
      
      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, onNodeDataChange, setNodes]
  );

  // Clear the flow
  const handleClearFlow = useCallback(() => {
    // Keep only the start node
    const startNode: CustomNode = {
      id: 'start-node',
      type: NodeTypes.START,
      position: { x: 250, y: 50 },
      data: { label: 'Start', type: NodeTypes.START }
    };
    
    setNodes([startNode]);
    setEdges([]);
    
    toast({
      title: "Flow Cleared",
      description: "The node editor has been reset",
    });
  }, [setNodes, setEdges, toast]);

  // Generate code preview
  const handleGenerateCode = useCallback(() => {
    const script = generateScript(nodes, edges);
    setGeneratedCode(script);
    setShowCodeDialog(true);
  }, [nodes, edges]);

  // Save the script
  const handleSaveScript = useCallback(async () => {
    if (!scriptName) {
      toast({
        title: "Error",
        description: "Please enter a script name",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const script = generateScript(nodes, edges);
      
      if (onScriptSave) {
        await onScriptSave(scriptName, script, nodes, edges);
      }
      
      toast({
        title: "Success",
        description: `Script "${scriptName}" saved successfully`,
      });
    } catch (error) {
      console.error("Error saving script:", error);
      toast({
        title: "Error",
        description: "Failed to save script",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [scriptName, nodes, edges, onScriptSave, toast]);

  // Run the script
  const handleRunScript = useCallback(async () => {
    setIsRunning(true);
    try {
      const script = generateExecutableScript(nodes, edges, false);
      
      if (onScriptRun) {
        await onScriptRun(script);
      }
      
      toast({
        title: "Success",
        description: "Script executed successfully",
      });
    } catch (error) {
      console.error("Error running script:", error);
      toast({
        title: "Error",
        description: "Failed to run script",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  }, [nodes, edges, onScriptRun, toast]);

  // Export the flow as JSON
  const handleExportFlow = useCallback(() => {
    const flow = { nodes, edges };
    const json = JSON.stringify(flow, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${scriptName.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Flow Exported",
      description: "The node configuration has been exported as JSON",
    });
  }, [nodes, edges, scriptName, toast]);

  // Import flow from JSON
  const handleImportFlow = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;
      
      const file = target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const result = event.target?.result as string;
          const flow = JSON.parse(result);
          
          if (flow.nodes && flow.edges) {
            // Make sure data.onChange is properly set for all nodes
            const nodesWithOnChange = flow.nodes.map((node: CustomNode) => ({
              ...node,
              data: {
                ...node.data,
                onChange: onNodeDataChange
              }
            }));
            
            setNodes(nodesWithOnChange);
            setEdges(flow.edges);
            
            toast({
              title: "Flow Imported",
              description: "The node configuration has been imported successfully",
            });
          } else {
            throw new Error("Invalid flow JSON structure");
          }
        } catch (error) {
          console.error("Error importing flow:", error);
          toast({
            title: "Error",
            description: "Failed to import flow: Invalid JSON format",
            variant: "destructive"
          });
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  }, [setNodes, setEdges, onNodeDataChange, toast]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDragOver,
    onDrop,
    reactFlowInstance,
    setReactFlowInstance,
    scriptName,
    setScriptName,
    generatedCode,
    showCodeDialog,
    setShowCodeDialog,
    isSaving,
    isRunning,
    initializeEditor,
    handleClearFlow,
    handleGenerateCode,
    handleSaveScript,
    handleRunScript,
    handleExportFlow,
    handleImportFlow,
  };
};

export default useNodeEditorState;
