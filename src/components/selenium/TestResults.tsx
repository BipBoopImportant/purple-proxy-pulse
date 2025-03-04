
import React from 'react';
import { Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Section from "@/components/ui/section";

interface TestResultsProps {
  testResults: any;
}

const TestResults: React.FC<TestResultsProps> = ({ testResults }) => {
  if (!testResults) return null;

  return (
    <Section title="Test Results" description="Results from the last Selenium test run">
      <Card className="glass-morphism border border-purple-900/30">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              {testResults.success ? (
                <div className="flex items-center text-green-500 gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="font-medium">Success</span>
                </div>
              ) : (
                <div className="flex items-center text-red-500 gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="font-medium">Failed</span>
                </div>
              )}
              <span className="text-muted-foreground text-sm">{testResults.message}</span>
            </div>
            
            {testResults.screenshots && testResults.screenshots.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Screenshots:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testResults.screenshots.map((screenshot: string, index: number) => (
                    <div key={index} className="border border-purple-900/20 rounded-lg overflow-hidden">
                      <img 
                        src={screenshot} 
                        alt={`Screenshot ${index + 1}`} 
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {testResults.aiAnalysis && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">AI Analysis:</h3>
                  <Badge className="bg-purple-600">
                    <Brain size={12} className="mr-1" />
                    AI Enhanced
                  </Badge>
                </div>
                
                <Card className="bg-black/30 border border-purple-500/20">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">Page Title</h4>
                          <p className="text-sm">{testResults.aiAnalysis.pageTitle}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">Detected Type</h4>
                          <p className="text-sm">{testResults.aiAnalysis.detectedType}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-1">Security Features</h4>
                        <div className="flex flex-wrap gap-1">
                          {testResults.aiAnalysis.securityFeatures.map((feature: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-1">Suggested Actions</h4>
                        <ul className="text-sm space-y-1 list-disc list-inside">
                          {testResults.aiAnalysis.suggestedActions.map((action: string, index: number) => (
                            <li key={index}>{action}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-1">Detected Elements</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-xs text-purple-400">Inputs:</span> {testResults.aiAnalysis.detectedElements.inputs.join(", ")}
                          </div>
                          <div>
                            <span className="text-xs text-purple-400">Buttons:</span> {testResults.aiAnalysis.detectedElements.buttons.join(", ")}
                          </div>
                          <div>
                            <span className="text-xs text-purple-400">Links:</span> {testResults.aiAnalysis.detectedElements.links.join(", ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Section>
  );
};

export default TestResults;
