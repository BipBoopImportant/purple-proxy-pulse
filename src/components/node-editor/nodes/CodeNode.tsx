
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { NodeTypes, NODE_COLORS } from '../NodeTypes';
import { Textarea } from "@/components/ui/textarea";

interface CodeNodeProps {
  data: {
    code?: string;
    onChange?: (id: string, data: any) => void;
  };
  id: string;
}

const CodeNode: React.FC<CodeNodeProps> = ({ data, id }) => {
  const nodeType = NodeTypes.CODE;
  const backgroundColor = NODE_COLORS[nodeType];
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (data.onChange) {
      data.onChange(id, { code: e.target.value });
    }
  };
  
  return (
    <div
      className="p-3 rounded-md shadow-md border min-w-[250px] max-w-[300px]"
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
      
      <div className="mb-2 font-medium text-sm">Custom Code</div>
      
      <Textarea 
        placeholder="// Enter your custom JavaScript code here"
        value={data.code || ''} 
        onChange={handleCodeChange} 
        className="bg-black/30 border-purple-900/30 text-xs h-[100px] font-mono"
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 rounded-full bg-purple-500 border-2 border-background"
      />
    </div>
  );
};

export default memo(CodeNode);
