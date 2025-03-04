
import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Panel,
  Connection,
  addEdge,
  Node,
  Edge,
  OnConnect,
  useReactFlow,
  MarkerType
} from '@xyflow/react';
import { CustomNode, CustomEdge, NODE_COLORS, NodeTypes } from '../NodeTypes';
import '@xyflow/react/dist/style.css';

interface FlowCanvasProps {
  nodes: CustomNode[];
  edges: CustomEdge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: OnConnect;
  onInit: (instance: any) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  nodeTypes: Record<string, React.ComponentType<any>>;
  children?: React.ReactNode;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onInit,
  onDragOver,
  onDrop,
  nodeTypes,
  children
}) => {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={onInit}
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
      {children}
    </ReactFlow>
  );
};

export default FlowCanvas;
