
import React, { useRef, useEffect } from 'react';
import { Panel } from '@xyflow/react';

import NodePanel from './NodePanel';
import NodeControls from './NodeControls';
import BasicNode from './nodes/BasicNode';
import NavigateNode from './nodes/NavigateNode';
import ClickNode from './nodes/ClickNode';
import TypeNode from './nodes/TypeNode';
import WaitNode from './nodes/WaitNode';
import CodeNode from './nodes/CodeNode';
import CodePreviewDialog from './components/CodePreviewDialog';
import { NodeTypes, CustomNode, CustomEdge } from './NodeTypes';
import FlowCanvas from './components/FlowCanvas';
import useNodeEditorState from './hooks/useNodeEditorState';

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
  onScriptSave?: (scriptName: string, script: string, nodes: CustomNode[], edges: CustomEdge[]) => void;
  onScriptRun?: (script: string) => void;
}

const NodeEditor: React.FC<NodeEditorProps> = ({
  initialScript,
  onScriptSave,
  onScriptRun
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  const {
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
  } = useNodeEditorState({ onScriptSave, onScriptRun });

  // Handle node drag from panel
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: NodeTypes) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  useEffect(() => {
    initializeEditor();
  }, [initializeEditor]);

  return (
    <div className="h-[600px] relative border border-purple-900/30 rounded-md overflow-hidden">
      <div ref={reactFlowWrapper} className="h-full">
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
        >
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
        </FlowCanvas>
      </div>
      
      <CodePreviewDialog
        open={showCodeDialog}
        onOpenChange={setShowCodeDialog}
        generatedCode={generatedCode}
      />
    </div>
  );
};

export default NodeEditor;
