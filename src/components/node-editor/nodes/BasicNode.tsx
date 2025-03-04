
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NodeTypes, NODE_COLORS, NodeData } from '../NodeTypes';

interface BasicNodeProps extends NodeProps<NodeData> {
  id: string;
  type: string;
}

const BasicNode: React.FC<BasicNodeProps> = ({ data, id, type }) => {
  const nodeType = data.type as NodeTypes || NodeTypes.CODE;
  const backgroundColor = NODE_COLORS[nodeType];
  
  return (
    <div
      className="px-4 py-2 rounded-md shadow-md border border-purple-900/30 font-medium text-sm"
      style={{ 
        backgroundColor: `${backgroundColor}40`, 
        borderColor: backgroundColor 
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 rounded-full bg-purple-500 border-2 border-background"
      />
      
      {data.label || type}
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 rounded-full bg-purple-500 border-2 border-background"
      />
    </div>
  );
};

export default memo(BasicNode);
