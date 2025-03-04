
import React from 'react';
import { Input } from "@/components/ui/input";
import NodeEditor from "@/components/node-editor/NodeEditor";
import { CustomNode, CustomEdge } from '@/components/node-editor/NodeTypes';

interface VisualNodeEditorProps {
  url: string;
  setUrl: (url: string) => void;
  onSaveScript: (scriptName: string, scriptCode: string, nodes: CustomNode[], edges: CustomEdge[]) => Promise<boolean>;
  onRunScript: (scriptCode: string) => Promise<void>;
}

const VisualNodeEditor: React.FC<VisualNodeEditorProps> = ({
  url,
  setUrl,
  onSaveScript,
  onRunScript
}) => {
  return (
    <div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-sm font-medium">Visual Node Editor</h3>
            <p className="text-xs text-muted-foreground">Create Selenium scripts by connecting nodes</p>
          </div>
          <div>
            <div className="text-sm mb-1">Test URL:</div>
            <div className="flex space-x-2">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-background/50 w-64 h-8"
              />
            </div>
          </div>
        </div>
      </div>
      
      <NodeEditor 
        onScriptSave={onSaveScript}
        onScriptRun={onRunScript}
      />
    </div>
  );
};

export default VisualNodeEditor;
