
import React from 'react';
import { FileCode, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SeleniumScript } from "@/lib/api";

interface ScriptLibraryProps {
  scripts: SeleniumScript[] | undefined;
  onLoadScript: (script: SeleniumScript) => void;
}

const ScriptLibrary: React.FC<ScriptLibraryProps> = ({ scripts, onLoadScript }) => {
  return (
    <Card className="glass-morphism border border-purple-900/30">
      <CardContent className="p-6">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {scripts?.map((script) => (
              <Card key={script.id} className="border border-purple-900/20 bg-black/20">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{script.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onLoadScript(script)}
                        className="h-7 px-2"
                      >
                        <FileCode size={14} />
                        <span className="ml-1">Load</span>
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{script.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {script.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date(script.updatedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {(!scripts || scripts.length === 0) && (
              <div className="text-center py-12">
                <Info className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">No scripts found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ScriptLibrary;
