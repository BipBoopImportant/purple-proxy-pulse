
import React from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { NodeTypes, NODE_COLORS, NODE_DESCRIPTIONS } from './NodeTypes';
import { Plus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface NodePanelProps {
  onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeType: NodeTypes) => void;
}

const NodePanel: React.FC<NodePanelProps> = ({ onDragStart }) => {
  return (
    <div className="bg-black/20 border border-purple-900/30 rounded-md overflow-hidden">
      <div className="bg-black/30 p-3 border-b border-purple-900/30">
        <h3 className="text-sm font-medium">Available Nodes</h3>
        <p className="text-xs text-muted-foreground">Drag nodes to the canvas</p>
      </div>
      
      <ScrollArea className="h-[500px]">
        <div className="p-4 space-y-3">
          {Object.values(NodeTypes).map((nodeType) => (
            <div
              key={nodeType}
              className="bg-black/10 hover:bg-black/20 border border-purple-900/20 rounded-md p-3 cursor-grab transition-colors"
              draggable
              onDragStart={(event) => onDragStart(event, nodeType)}
            >
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: NODE_COLORS[nodeType] }}
                />
                <span className="font-medium text-sm">{nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{NODE_DESCRIPTIONS[nodeType]}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NodePanel;
