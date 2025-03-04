
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Chrome, RotateCw, Brain } from "lucide-react";

interface SimpleUrlTestProps {
  url: string;
  setUrl: (url: string) => void;
  takeScreenshots: boolean;
  setTakeScreenshots: (value: boolean) => void;
  headless: boolean;
  setHeadless: (value: boolean) => void;
  forwardToAI: boolean;
  setForwardToAI: (value: boolean) => void;
  isRunningTest: boolean;
  onRunTest: () => void;
}

const SimpleUrlTest: React.FC<SimpleUrlTestProps> = ({
  url,
  setUrl,
  takeScreenshots,
  setTakeScreenshots,
  headless,
  setHeadless,
  forwardToAI,
  setForwardToAI,
  isRunningTest,
  onRunTest
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="test-url">URL to Test</Label>
        <Input
          id="test-url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-background/50"
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="screenshots" 
            checked={takeScreenshots} 
            onCheckedChange={(checked) => setTakeScreenshots(!!checked)} 
          />
          <Label htmlFor="screenshots">Take Screenshots</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="headless" 
            checked={headless} 
            onCheckedChange={(checked) => setHeadless(!!checked)} 
          />
          <Label htmlFor="headless">Headless Mode</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="forward-to-ai" 
            checked={forwardToAI} 
            onCheckedChange={(checked) => setForwardToAI(!!checked)} 
          />
          <Label htmlFor="forward-to-ai" className="flex items-center gap-1">
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
            <Chrome size={16} className="mr-2" />
            Run Simple Test
          </>
        )}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/10 to-purple-500/20 transform transition-transform duration-300 ease-out -translate-x-full group-hover:translate-x-0"></span>
      </Button>
    </div>
  );
};

export default SimpleUrlTest;
