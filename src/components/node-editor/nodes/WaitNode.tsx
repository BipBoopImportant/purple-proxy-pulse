
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { NodeTypes, NODE_COLORS } from '../NodeTypes';
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface WaitNodeProps {
  data: {
    elementType?: string;
    selector?: string;
    wait?: number;
    timeout?: number;
    onChange?: (id: string, data: any) => void;
  };
  id: string;
}

const WaitNode: React.FC<WaitNodeProps> = ({ data, id }) => {
  const nodeType = NodeTypes.WAIT;
  const backgroundColor = NODE_COLORS[nodeType];
  
  const handleElementTypeChange = (value: string) => {
    if (data.onChange) {
      data.onChange(id, { elementType: value });
    }
  };
  
  const handleSelectorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (data.onChange) {
      data.onChange(id, { selector: e.target.value });
    }
  };
  
  const handleWaitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (data.onChange) {
      data.onChange(id, { wait: parseInt(e.target.value) || 0 });
    }
  };
  
  const handleTimeoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (data.onChange) {
      data.onChange(id, { timeout: parseInt(e.target.value) || 10000 });
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
      
      <div className="mb-2 font-medium text-sm">Wait</div>
      
      <RadioGroup 
        value={data.elementType || 'element'} 
        onValueChange={handleElementTypeChange}
        className="mb-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="element" id="element" />
          <Label htmlFor="element" className="text-xs">Wait for Element</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="time" id="time" />
          <Label htmlFor="time" className="text-xs">Wait Fixed Time</Label>
        </div>
      </RadioGroup>
      
      {data.elementType === 'element' || !data.elementType ? (
        <>
          <div className="space-y-1 mb-2">
            <label className="text-xs block">CSS Selector</label>
            <Input 
              type="text" 
              placeholder="#element, .loader, etc." 
              value={data.selector || ''} 
              onChange={handleSelectorChange} 
              className="bg-black/30 border-purple-900/30 text-xs py-1 h-7"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs block">Timeout (ms)</label>
            <Input 
              type="number" 
              placeholder="10000" 
              value={data.timeout || 10000} 
              onChange={handleTimeoutChange} 
              className="bg-black/30 border-purple-900/30 text-xs py-1 h-7"
            />
          </div>
        </>
      ) : (
        <div className="space-y-1">
          <label className="text-xs block">Wait Time (ms)</label>
          <Input 
            type="number" 
            placeholder="1000" 
            value={data.wait || 1000} 
            onChange={handleWaitChange} 
            className="bg-black/30 border-purple-900/30 text-xs py-1 h-7"
          />
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 rounded-full bg-purple-500 border-2 border-background"
      />
    </div>
  );
};

export default memo(WaitNode);
