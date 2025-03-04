
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { NodeTypes, NODE_COLORS } from '../NodeTypes';
import { Input } from "@/components/ui/input";

interface TypeNodeProps {
  data: {
    selector?: string;
    value?: string;
    onChange?: (id: string, data: any) => void;
  };
  id: string;
}

const TypeNode: React.FC<TypeNodeProps> = ({ data, id }) => {
  const nodeType = NodeTypes.TYPE;
  const backgroundColor = NODE_COLORS[nodeType];
  
  const handleSelectorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (data.onChange) {
      data.onChange(id, { selector: e.target.value });
    }
  };
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (data.onChange) {
      data.onChange(id, { value: e.target.value });
    }
  };
  
  return (
    <div
      className="p-3 rounded-md shadow-md border min-w-[200px]"
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
      
      <div className="mb-2 font-medium text-sm">Type Text</div>
      
      <div className="space-y-1 mb-2">
        <label className="text-xs block">CSS Selector</label>
        <Input 
          type="text" 
          placeholder="input[name='username']" 
          value={data.selector || ''} 
          onChange={handleSelectorChange} 
          className="bg-black/30 border-purple-900/30 text-xs py-1 h-7"
        />
      </div>
      
      <div className="space-y-1">
        <label className="text-xs block">Text to Type</label>
        <Input 
          type="text" 
          placeholder="Text to type..." 
          value={data.value || ''} 
          onChange={handleValueChange} 
          className="bg-black/30 border-purple-900/30 text-xs py-1 h-7"
        />
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 rounded-full bg-purple-500 border-2 border-background"
      />
    </div>
  );
};

export default memo(TypeNode);
