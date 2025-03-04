
import React, { useState } from 'react';
import { Plus, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ScriptEditorProps {
  script: string;
  setScript: (script: string) => void;
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({ script, setScript }) => {
  const [scriptName, setScriptName] = useState("");
  const [scriptTags, setScriptTags] = useState("");
  const [scriptDescription, setScriptDescription] = useState("");

  const handleClear = () => {
    setScript("");
    setScriptName("");
    setScriptTags("");
    setScriptDescription("");
  };

  const handleSave = () => {
    // This would be implemented to save the script
    console.log("Saving script:", { name: scriptName, tags: scriptTags, description: scriptDescription, code: script });
  };

  return (
    <Card className="glass-morphism border border-purple-900/30">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="script-name">Script Name</Label>
              <Input
                id="script-name"
                placeholder="My Selenium Script"
                className="bg-background/50"
                value={scriptName}
                onChange={(e) => setScriptName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="script-tags">Tags (comma separated)</Label>
              <Input
                id="script-tags"
                placeholder="login, form, authentication"
                className="bg-background/50"
                value={scriptTags}
                onChange={(e) => setScriptTags(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="script-description">Description</Label>
            <Textarea
              id="script-description"
              placeholder="Describe what this script does"
              className="bg-background/50 h-[60px]"
              value={scriptDescription}
              onChange={(e) => setScriptDescription(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="script-code">Script Code</Label>
            <Textarea
              id="script-code"
              placeholder="// Enter your Selenium script here"
              className="font-mono text-sm h-[200px] bg-background/50"
              value={script}
              onChange={(e) => setScript(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClear}>
              <Trash size={16} className="mr-2" />
              Clear
            </Button>
            <Button onClick={handleSave}>
              <Plus size={16} className="mr-2" />
              Save Script
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScriptEditor;
