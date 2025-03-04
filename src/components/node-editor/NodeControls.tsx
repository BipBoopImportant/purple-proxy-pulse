
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, Play, Trash, Download, Upload, Code, RefreshCw } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface NodeControlsProps {
  onSave: () => void;
  onRun: () => void;
  onClear: () => void;
  onExport: () => void;
  onImport: () => void;
  onGenerateCode: () => void;
  scriptName: string;
  onScriptNameChange: (name: string) => void;
  isSaving: boolean;
  isRunning: boolean;
}

const NodeControls: React.FC<NodeControlsProps> = ({
  onSave,
  onRun,
  onClear,
  onExport,
  onImport,
  onGenerateCode,
  scriptName,
  onScriptNameChange,
  isSaving,
  isRunning
}) => {
  return (
    <div className="bg-black/20 border border-purple-900/30 rounded-md p-4 flex flex-col gap-4">
      <div>
        <label htmlFor="script-name" className="text-sm font-medium mb-1 block">Script Name</label>
        <Input
          id="script-name"
          placeholder="My Selenium Script"
          value={scriptName}
          onChange={(e) => onScriptNameChange(e.target.value)}
          className="bg-background/50"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={onSave} 
          disabled={isSaving}
          className="relative overflow-hidden group"
        >
          {isSaving ? (
            <>
              <RefreshCw size={16} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Save
            </>
          )}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/10 to-purple-500/20 transform transition-transform duration-300 ease-out -translate-x-full group-hover:translate-x-0"></span>
        </Button>
        
        <Button 
          onClick={onRun} 
          disabled={isRunning} 
          variant="default"
          className="relative overflow-hidden group"
        >
          {isRunning ? (
            <>
              <RefreshCw size={16} className="mr-2 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play size={16} className="mr-2" />
              Run
            </>
          )}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/10 to-purple-500/20 transform transition-transform duration-300 ease-out -translate-x-full group-hover:translate-x-0"></span>
        </Button>
        
        <Button onClick={onClear} variant="outline">
          <Trash size={16} className="mr-2" />
          Clear
        </Button>
        
        <Button onClick={onGenerateCode} variant="outline">
          <Code size={16} className="mr-2" />
          Generate Code
        </Button>
        
        <Button onClick={onExport} variant="outline">
          <Download size={16} className="mr-2" />
          Export
        </Button>
        
        <Button onClick={onImport} variant="outline">
          <Upload size={16} className="mr-2" />
          Import
        </Button>
      </div>
      
      <div>
        <Badge variant="outline">Visual Node Editor</Badge>
        <p className="text-xs text-muted-foreground mt-1">
          Build your Selenium script visually by connecting nodes. The script will be converted to code when saved or run.
        </p>
      </div>
    </div>
  );
};

export default NodeControls;
