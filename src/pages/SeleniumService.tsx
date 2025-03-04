
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import Section from "@/components/ui/section";
import LogTerminal, { LogEntry } from "@/components/ui/log-terminal";
import { getServiceLogs, runSeleniumTest, getStoredScripts, SeleniumScript } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomNode, CustomEdge } from '@/components/node-editor/NodeTypes';

// Import refactored components
import ServiceStats from "@/components/selenium/ServiceStats";
import SimpleUrlTest from "@/components/selenium/SimpleUrlTest";
import ScriptTest from "@/components/selenium/ScriptTest";
import ScriptLibrary from "@/components/selenium/ScriptLibrary";
import ScriptEditor from "@/components/selenium/ScriptEditor";
import VisualNodeEditor from "@/components/selenium/VisualNodeEditor";
import TestResults from "@/components/selenium/TestResults";

const SeleniumService = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState<string>("");
  const [script, setScript] = useState<string>("");
  const [takeScreenshots, setTakeScreenshots] = useState<boolean>(true);
  const [headless, setHeadless] = useState<boolean>(true);
  const [forwardToAI, setForwardToAI] = useState<boolean>(true);
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [testResults, setTestResults] = useState<any>(null);
  const [activeScript, setActiveScript] = useState<SeleniumScript | null>(null);
  
  const { data: storedScripts, refetch: refetchScripts } = useQuery({
    queryKey: ["storedScripts"],
    queryFn: getStoredScripts,
  });
  
  useEffect(() => {
    setLogs(getServiceLogs("selenium", 15));
    
    const interval = setInterval(() => {
      const newLog = getServiceLogs("selenium", 1)[0];
      setLogs(prev => [...prev.slice(-99), newLog]);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleRunTest = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }
    
    setIsRunningTest(true);
    setTestResults(null);
    
    try {
      const startLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        level: "info",
        service: "Selenium",
        message: `Starting test on: ${url}${forwardToAI ? " with AI analysis" : ""}`,
      };
      setLogs(prev => [...prev, startLog]);
      
      const options = {
        takeScreenshots,
        headless,
        script: script || undefined,
        forwardToAI,
      };
      
      const result = await runSeleniumTest(url, options);
      
      const resultLog: LogEntry = {
        id: `log-${Date.now() + 1}`,
        timestamp: new Date(),
        level: result.success ? "success" : "error",
        service: "Selenium",
        message: result.message,
      };
      setLogs(prev => [...prev, resultLog]);
      
      if (result.logs) {
        setLogs(prev => [...prev, ...result.logs]);
      }
      
      if (result.aiAnalysis) {
        const aiLog: LogEntry = {
          id: `log-${Date.now() + 2}`,
          timestamp: new Date(),
          level: "info",
          service: "Selenium",
          message: `AI analysis completed for ${url}: Detected ${result.aiAnalysis.detectedType}`,
        };
        setLogs(prev => [...prev, aiLog]);
      }
      
      setTestResults(result);
      
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error running Selenium test:", error);
      
      const errorLog: LogEntry = {
        id: `log-${Date.now() + 3}`,
        timestamp: new Date(),
        level: "error",
        service: "Selenium",
        message: "An unexpected error occurred while running the test",
      };
      setLogs(prev => [...prev, errorLog]);
      
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRunningTest(false);
    }
  };
  
  const handleLoadScript = (script: SeleniumScript) => {
    setActiveScript(script);
    setScript(script.code);
    
    toast({
      title: "Script Loaded",
      description: `Loaded script: ${script.name}`,
    });
  };
  
  const handleSaveScript = async (scriptName: string, scriptCode: string, nodes: CustomNode[], edges: CustomEdge[]) => {
    console.log("Saving script:", scriptName, nodes.length, "nodes");
    
    const saveLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      level: "info",
      service: "Selenium",
      message: `Script "${scriptName}" saved with ${nodes.length} nodes and ${edges.length} connections`,
    };
    setLogs(prev => [...prev, saveLog]);
    
    setScript(scriptCode);
    
    toast({
      title: "Script Saved",
      description: `Script "${scriptName}" has been saved successfully.`,
    });
    
    await refetchScripts();
    
    return true;
  };
  
  const handleRunNodeScript = async (scriptCode: string) => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL to test",
        variant: "destructive",
      });
      return;
    }
    
    setIsRunningTest(true);
    setTestResults(null);
    
    try {
      const startLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        level: "info",
        service: "Selenium",
        message: `Starting visual node script test on: ${url}${forwardToAI ? " with AI analysis" : ""}`,
      };
      setLogs(prev => [...prev, startLog]);
      
      const options = {
        takeScreenshots,
        headless,
        script: scriptCode,
        forwardToAI,
      };
      
      const result = await runSeleniumTest(url, options);
      
      const resultLog: LogEntry = {
        id: `log-${Date.now() + 1}`,
        timestamp: new Date(),
        level: result.success ? "success" : "error",
        service: "Selenium",
        message: result.message,
      };
      setLogs(prev => [...prev, resultLog]);
      
      setTestResults(result);
      
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error running Selenium test:", error);
      
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRunningTest(false);
    }
  };
  
  const sampleScript = `// This is a sample Selenium script
// It will be executed in the Selenium instance

// Wait for the page to load
await driver.wait(until.elementLocated(By.css('body')), 10000);

// Find the search input
const searchInput = await driver.findElement(By.name('q'));

// Type in the search box
await searchInput.sendKeys('Selenium automation');

// Submit the form
await searchInput.submit();

// Wait for results
await driver.wait(until.titleContains('Selenium automation'), 5000);

// Take a screenshot
await driver.takeScreenshot();

// Log the title
console.log('Page title:', await driver.getTitle());`;

  return (
    <div className="space-y-8">
      <Section>
        <motion.h1 
          className="text-3xl font-semibold tracking-tight mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Selenium Service
        </motion.h1>
        <motion.p 
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Run automated browser tests and scrape dynamic websites
        </motion.p>
      </Section>

      <ServiceStats />

      <Section title="Run Selenium Test" description="Execute browser automation and testing">
        <Card className="glass-morphism border border-purple-900/30">
          <CardContent className="p-6">
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="url">Simple URL Test</TabsTrigger>
                <TabsTrigger value="script">Custom Script Test</TabsTrigger>
              </TabsList>
              
              <TabsContent value="url">
                <SimpleUrlTest 
                  url={url}
                  setUrl={setUrl}
                  takeScreenshots={takeScreenshots}
                  setTakeScreenshots={setTakeScreenshots}
                  headless={headless}
                  setHeadless={setHeadless}
                  forwardToAI={forwardToAI}
                  setForwardToAI={setForwardToAI}
                  isRunningTest={isRunningTest}
                  onRunTest={handleRunTest}
                />
              </TabsContent>
              
              <TabsContent value="script">
                <ScriptTest 
                  url={url}
                  setUrl={setUrl}
                  script={script}
                  setScript={setScript}
                  takeScreenshots={takeScreenshots}
                  setTakeScreenshots={setTakeScreenshots}
                  headless={headless}
                  setHeadless={setHeadless}
                  forwardToAI={forwardToAI}
                  setForwardToAI={setForwardToAI}
                  isRunningTest={isRunningTest}
                  onRunTest={handleRunTest}
                  activeScript={activeScript}
                  sampleScript={sampleScript}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </Section>

      <Section title="Script Management" description="Manage and create Selenium scripts">
        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="library">Script Library</TabsTrigger>
            <TabsTrigger value="editor">Script Editor</TabsTrigger>
            <TabsTrigger value="visual">Visual Node Editor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="library">
            <ScriptLibrary 
              scripts={storedScripts}
              onLoadScript={handleLoadScript}
            />
          </TabsContent>
          
          <TabsContent value="editor">
            <ScriptEditor 
              script={script}
              setScript={setScript}
            />
          </TabsContent>
          
          <TabsContent value="visual">
            <VisualNodeEditor 
              url={url}
              setUrl={setUrl}
              onSaveScript={handleSaveScript}
              onRunScript={handleRunNodeScript}
            />
          </TabsContent>
        </Tabs>
      </Section>

      {testResults && <TestResults testResults={testResults} />}

      <Section title="Service Logs" description="Real-time logs from the Selenium service">
        <LogTerminal
          logs={logs}
          title="Selenium Service Logs"
          height="h-[400px]"
        />
      </Section>
    </div>
  );
};

export default SeleniumService;
