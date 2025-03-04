
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface CodePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generatedCode: string;
}

const CodePreviewDialog: React.FC<CodePreviewDialogProps> = ({
  open,
  onOpenChange,
  generatedCode
}) => {
  const { toast } = useToast();

  const copyGeneratedCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Code Copied",
      description: "The generated code has been copied to clipboard",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-background border border-purple-900/30">
        <DialogHeader>
          <DialogTitle>Generated Selenium Script</DialogTitle>
          <DialogDescription>
            This is the code generated from your visual flow. You can copy it or use it directly.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative">
          <Textarea 
            className="h-[400px] font-mono text-sm bg-black/20 border-purple-900/30"
            value={generatedCode}
            readOnly
          />
          <Button 
            className="absolute top-2 right-2"
            size="sm"
            onClick={copyGeneratedCode}
          >
            Copy Code
          </Button>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodePreviewDialog;
