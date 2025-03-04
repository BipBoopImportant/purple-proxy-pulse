import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
  MarkerType
} from '@xyflow/react';
import { useToast } from "@/components/ui/use-toast";
import NodePanel from './NodePanel';
import NodeControls from './NodeControls';
import { NodeTypes, CustomNode, generateNodeCode } from './NodeTypes';
import BasicNode from './nodes/BasicNode';
import NavigateNode from './nodes/NavigateNode';
import ClickNode from './nodes/ClickNode';
import TypeNode from './nodes/TypeNode';
import WaitNode from './nodes/WaitNode';
import CodeNode from './nodes/CodeNode';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Import the styles
import '@xyflow/react/dist/style.css';

// Define node types mapping
const nodeTypes = {
  [NodeTypes.START]: BasicNode,
  [NodeTypes.NAVIGATE]: NavigateNode,
  [NodeTypes.CLICK]: ClickNode,
  [NodeTypes.TYPE]: TypeNode,
  [NodeTypes.WAIT]: WaitNode,
  [NodeTypes.SCREENSHOT]: BasicNode,
  [NodeTypes.EXTRACT]: BasicNode,
  [NodeTypes.CONDITION]: BasicNode,
  [NodeTypes.CODE]: CodeNode,
  [NodeTypes.END]: BasicNode,
};

interface NodeEditorProps {
  initialScript?: string;
  onScriptSave?: (scriptName: string, script: string, nodes: CustomNode[], edges: Edge[]) => void;
  onScriptRun?: (script: string) => void;
}

const NodeEditor: React.FC<NodeEditorProps> = ({
  initialScript,
  onScriptSave,
  onScriptRun
}) => {
  const { toast } = useToast();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [scriptName, setScriptName] = useState('My Selenium Script');
  const [generatedCode, setGeneratedCode] = useState('');
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Initialize with a start node
    if (nodes.length === 0) {
      const startNode: CustomNode = {
        id: 'start-node',
        type: NodeTypes.START,
        position: { x: 250, y: 50 },
        data: { label: 'Start', type: NodeTypes.START }
      };
      
      setNodes([startNode]);
    }
  }, []);

  // Handle node drag from panel
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: NodeTypes) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

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
      
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

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

  // Generate Selenium script from nodes
  const generateScript = useCallback(() => {
    // Sort nodes based on connections/edges
    const sortedNodes: CustomNode[] = [];
    const visited = new Set<string>();
    const nodeMap = new Map<string, CustomNode>();
    
    // Create a map of node id to node
    nodes.forEach(node => {
      nodeMap.set(node.id, node as CustomNode);
    });
    
    // Start with the start node
    const startNode = nodes.find(node => node.type === NodeTypes.START);
    if (!startNode) {
      toast({
        title: "Error",
        description: "No start node found in the flow",
        variant: "destructive"
      });
      return '';
    }
    
    // Use DFS to traverse the graph
    const dfs = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      
      const node = nodeMap.get(nodeId);
      if (node) {
        sortedNodes.push(node);
        
        // Find outgoing edges from this node
        const outgoingEdges = edges.filter(edge => edge.source === nodeId);
        outgoingEdges.forEach(edge => {
          if (edge.target) {
            dfs(edge.target);
          }
        });
      }
    };
    
    // Start DFS from the start node
    dfs(startNode.id);
    
    // Generate code from sorted nodes
    let script = '// Generated Selenium script\n\n';
    
    // Add setup code
    script += `// Setup
const { Builder, By, Key, until, Select } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function runTest() {
  let driver;
  
  try {
    // Set up Chrome options
    const options = new chrome.Options();
    ${!isRunning ? '// ' : ''}options.addArguments('--headless');
    
    // Build the driver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
      
    // Set implicit wait
    await driver.manage().setTimeouts({ implicit: 10000 });
    
    // Test script begins
`;
    
    // Add code for each node
    sortedNodes.forEach(node => {
      if (node.type in NodeTypes) {
        script += '    ' + generateNodeCode(node, node.type as NodeTypes).split('\n').join('\n    ');
      }
    });
    
    // Add cleanup code
    script += `
    // Test script ends
    
    console.log('Test completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Test failed:', error);
    return { success: false, error: error.message };
  } finally {
    // Cleanup
    if (driver) {
      await driver.quit();
    }
  }
})();
`;
    
    return script;
  }, [nodes, edges]);

  const handleClearFlow = () => {
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
  };

  const handleGenerateCode = () => {
    const script = generateScript();
    setGeneratedCode(script);
    setShowCodeDialog(true);
  };

  const handleSaveScript = async () => {
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
      const script = generateScript();
      
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
  };

  const handleRunScript = async () => {
    setIsRunning(true);
    try {
      const script = generateScript();
      
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
  };

  const handleExportFlow = () => {
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
  };

  const handleImportFlow = () => {
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
  };

  const copyGeneratedCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Code Copied",
      description: "The generated code has been copied to clipboard",
    });
  };

  return (
    <div className="h-[600px] relative border border-purple-900/30 rounded-md overflow-hidden">
      <div ref={reactFlowWrapper} className="h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
          className="bg-black/10"
        >
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              const nodeData = node.data as { type?: NodeTypes };
              return nodeData.type ? NODE_COLORS[nodeData.type] : '#555';
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
            className="bg-black/30 border border-purple-900/30 rounded-md"
          />
          <Background color="#aaa" gap={16} />
          
          <Panel position="top-left" className="w-64 ml-2 mt-2">
            <NodePanel onDragStart={onDragStart} />
          </Panel>
          
          <Panel position="top-right" className="w-80 mr-2 mt-2">
            <NodeControls
              onSave={handleSaveScript}
              onRun={handleRunScript}
              onClear={handleClearFlow}
              onExport={handleExportFlow}
              onImport={handleImportFlow}
              onGenerateCode={handleGenerateCode}
              scriptName={scriptName}
              onScriptNameChange={setScriptName}
              isSaving={isSaving}
              isRunning={isRunning}
            />
          </Panel>
        </ReactFlow>
      </div>
      
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="sm:max-w-[800px] bg-background border border-purple-900/30">
          <DialogHeader>
            <DialogTitle>Generated Selenium Script</DialogTitle>
            <DialogDescription>
              This is the code generated from your visual flow. You can copy it or use it directly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative">
            <Textarea 
              className="h-[400px] font-mono text-sm bg-black/20 border-purple-900/30"
              value={generatedCode}
              readOnly
            />
            <Button 
              className="absolute top-2 right-2"
              size="sm"
              onClick={copyGeneratedCode}
            >
              Copy Code
            </Button>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => setShowCodeDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NodeEditor;
