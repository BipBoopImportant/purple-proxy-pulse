
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Brain, RotateCw, Check, FileText, MessageSquareText } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import Section from "@/components/ui/section";
import StatCard from "@/components/ui/stat-card";
import LogTerminal, { LogEntry } from "@/components/ui/log-terminal";
import { getServiceStats, getChartData, getServiceLogs, analyzeWebpage } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const AIModel = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState<string>("");
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  // Fetch service stats
  const { data: stats } = useQuery({
    queryKey: ["serviceStats", "ai"],
    queryFn: () => getServiceStats("ai"),
    refetchInterval: 5000,
  });
  
  // Generate chart data
  const responseTimeData = useQuery({
    queryKey: ["chartData", "ai", "responseTime"],
    queryFn: () => getChartData(24, 2000, 500),
    refetchInterval: 60000,
  });
  
  const requestsData = useQuery({
    queryKey: ["chartData", "ai", "requests"],
    queryFn: () => getChartData(24, 50, 5),
    refetchInterval: 60000,
  });
  
  // Fetch logs
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Initial logs
    setLogs(getServiceLogs("ai", 15));
    
    // Simulate new logs coming in
    interval = setInterval(() => {
      const newLog = getServiceLogs("ai", 1)[0];
      setLogs(prev => [...prev.slice(-99), newLog]);
    }, 12000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleAnalyzeWebpage = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      // Add a log for the analysis start
      const startLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        level: "info",
        service: "AI Model",
        message: `Starting analysis of: ${url}${userPrompt ? ` with prompt: "${userPrompt}"` : ''}`,
      };
      setLogs(prev => [...prev, startLog]);
      
      const result = await analyzeWebpage(url, userPrompt);
      
      // Add result log
      const resultLog: LogEntry = {
        id: `log-${Date.now() + 1}`,
        timestamp: new Date(),
        level: result.success ? "success" : "error",
        service: "AI Model",
        message: result.message,
      };
      setLogs(prev => [...prev, resultLog]);
      
      if (result.success && result.analysis) {
        // Add detailed analysis log
        const analysisLog: LogEntry = {
          id: `log-${Date.now() + 2}`,
          timestamp: new Date(),
          level: "info",
          service: "AI Model",
          message: `Analysis complete: ${result.analysis.title} with ${result.analysis.fields.length} fields identified`,
        };
        setLogs(prev => [...prev, analysisLog]);
        
        setAnalysisResult(result.analysis);
      }
      
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error analyzing webpage:", error);
      
      // Add error log
      const errorLog: LogEntry = {
        id: `log-${Date.now() + 3}`,
        timestamp: new Date(),
        level: "error",
        service: "AI Model",
        message: "An unexpected error occurred during analysis",
      };
      setLogs(prev => [...prev, errorLog]);
      
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <Section>
        <motion.h1 
          className="text-3xl font-semibold tracking-tight mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          AI Model
        </motion.h1>
        <motion.p 
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Analyze webpages and forms using advanced machine learning
        </motion.p>
      </Section>

      <Section title="Service Statistics" description="Real-time AI model metrics">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="CPU Usage"
            value={`${stats?.cpuUsage.toFixed(1)}%`}
            chartData={getChartData(20, 100, 30)}
          />
          <StatCard
            title="Memory Usage"
            value={`${stats?.memoryUsage.toFixed(0)} MB`}
            chartData={getChartData(20, 4096, 1024)}
          />
          <StatCard
            title="Avg. Response Time"
            value={`${responseTimeData.data ? Math.round(responseTimeData.data.reduce((acc: number, item: any) => acc + item.value, 0) / responseTimeData.data.length) : "0"} ms`}
            chartData={responseTimeData.data}
          />
          <StatCard
            title="Requests / Hour"
            value={requestsData.data ? Math.round(requestsData.data.reduce((acc: number, item: any) => acc + item.value, 0) / 24) : "0"}
            chartData={requestsData.data}
          />
        </div>
      </Section>

      <Section title="Analyze Webpage" description="Analyze a webpage or form using the AI model">
        <Card className="glass-morphism border border-purple-900/30">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webpage-url">Webpage URL</Label>
                  <Input
                    id="webpage-url"
                    placeholder="https://example.com/form"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="analysis-prompt" className="flex items-center gap-2">
                    <MessageSquareText size={16} />
                    Analysis Instructions (Optional)
                  </Label>
                  <Textarea
                    id="analysis-prompt"
                    placeholder="Specify what to look for, e.g., 'Focus on identifying input validation patterns' or 'Check for hidden fields'"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="bg-background/50 min-h-[80px]"
                  />
                </div>
                
                <Button 
                  onClick={handleAnalyzeWebpage}
                  disabled={isAnalyzing}
                  className="relative overflow-hidden group"
                >
                  {isAnalyzing ? (
                    <>
                      <RotateCw size={16} className="mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain size={16} className="mr-2" />
                      Analyze Webpage
                    </>
                  )}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/10 to-purple-500/20 transform transition-transform duration-300 ease-out -translate-x-full group-hover:translate-x-0"></span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      {analysisResult && (
        <Section title="Analysis Results" description="AI-generated analysis of the webpage">
          <Card className="glass-morphism border border-purple-900/30">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-2">{analysisResult.title}</h3>
                  <p className="text-muted-foreground">{analysisResult.description}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <FileText size={16} className="mr-2" />
                    Detected Form Fields
                  </h4>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Field Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-center">Required</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysisResult.fields.map((field: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{field.name}</TableCell>
                            <TableCell>{field.type}</TableCell>
                            <TableCell className="text-center">
                              {field.required ? (
                                <Check size={16} className="mx-auto text-green-500" />
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>
      )}

      <Section title="Service Logs" description="Real-time logs from the AI model">
        <LogTerminal
          logs={logs}
          title="AI Model Logs"
          height="h-[400px]"
        />
      </Section>
    </div>
  );
};

export default AIModel;
