
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Code, RotateCw, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SeleniumScript } from "@/lib/api";

interface ScriptTestProps {
  url: string;
  setUrl: (url: string) => void;
  script: string;
  setScript: (script: string) => void;
  takeScreenshots: boolean;
  setTakeScreenshots: (value: boolean) => void;
  headless: boolean;
  setHeadless: (value: boolean) => void;
  forwardToAI: boolean;
  setForwardToAI: (value: boolean) => void;
  isRunningTest: boolean;
  onRunTest: () => void;
  activeScript: SeleniumScript | null;
  sampleScript: string;
}

const ScriptTest: React.FC<ScriptTestProps> = ({
  url,
  setUrl,
  script,
  setScript,
  takeScreenshots,
  setTakeScreenshots,
  headless,
  setHeadless,
  forwardToAI,
  setForwardToAI,
  isRunningTest,
  onRunTest,
  activeScript,
  sampleScript
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="test-url-script">URL to Test</Label>
        <Input
          id="test-url-script"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-background/50"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="script">Custom Selenium Script</Label>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => setScript(sampleScript)}
            >
              <Code size={12} className="mr-1" />
              Load Sample
            </Button>
            
            {activeScript && (
              <Badge variant="outline" className="ml-2">
                Active: {activeScript.name}
              </Badge>
            )}
          </div>
        </div>
        <Textarea
          id="script"
          placeholder="// Enter your Selenium script here"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          className="font-mono text-sm h-[200px] bg-background/50"
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="screenshots-script" 
            checked={takeScreenshots} 
            onCheckedChange={(checked) => setTakeScreenshots(!!checked)} 
          />
          <Label htmlFor="screenshots-script">Take Screenshots</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="headless-script" 
            checked={headless} 
            onCheckedChange={(checked) => setHeadless(!!checked)} 
          />
          <Label htmlFor="headless-script">Headless Mode</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="forward-to-ai-script" 
            checked={forwardToAI} 
            onCheckedChange={(checked) => setForwardToAI(!!checked)} 
          />
          <Label htmlFor="forward-to-ai-script" className="flex items-center gap-1">
            Forward to AI <Brain size={14} className="text-purple-400" />
          </Label>
        </div>
      </div>
      
      <Button 
        onClick={onRunTest}
        disabled={isRunningTest}
        className="relative overflow-hidden group"
      >
        {isRunningTest ? (
          <>
            <RotateCw size={16} className="mr-2 animate-spin" />
            Running...
          </>
        ) : (
          <>
            <Code size={16} className="mr-2" />
            Run Script
          </>
        )}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/10 to-purple-500/20 transform transition-transform duration-300 ease-out -translate-x-full group-hover:translate-x-0"></span>
      </Button>
    </div>
  );
};

export default ScriptTest;
