
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Chrome, RotateCw, Code, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import Section from "@/components/ui/section";
import StatCard from "@/components/ui/stat-card";
import LogTerminal, { LogEntry } from "@/components/ui/log-terminal";
import { getServiceStats, getChartData, getServiceLogs, runSeleniumTest } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const SeleniumService = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState<string>("");
  const [script, setScript] = useState<string>("");
  const [takeScreenshots, setTakeScreenshots] = useState<boolean>(true);
  const [headless, setHeadless] = useState<boolean>(true);
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [testResults, setTestResults] = useState<any>(null);
  
  // Fetch service stats
  const { data: stats } = useQuery({
    queryKey: ["serviceStats", "selenium"],
    queryFn: () => getServiceStats("selenium"),
    refetchInterval: 5000,
  });
  
  // Generate chart data
  const cpuData = useQuery({
    queryKey: ["chartData", "selenium", "cpu"],
    queryFn: () => getChartData(24, 100, 20),
    refetchInterval: 60000,
  });
  
  const memoryData = useQuery({
    queryKey: ["chartData", "selenium", "memory"],
    queryFn: () => getChartData(24, 2048, 512),
    refetchInterval: 60000,
  });
  
  // Fetch logs
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Initial logs
    setLogs(getServiceLogs("selenium", 15));
    
    // Simulate new logs coming in
    interval = setInterval(() => {
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
      // Add a log for the test start
      const startLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        level: "info",
        service: "Selenium",
        message: `Starting test on: ${url}`,
      };
      setLogs(prev => [...prev, startLog]);
      
      const options = {
        takeScreenshots,
        headless,
        script: script || undefined,
      };
      
      const result = await runSeleniumTest(url, options);
      
      // Add result logs
      const resultLog: LogEntry = {
        id: `log-${Date.now() + 1}`,
        timestamp: new Date(),
        level: result.success ? "success" : "error",
        service: "Selenium",
        message: result.message,
      };
      setLogs(prev => [...prev, resultLog]);
      
      // Add any logs from the result
      if (result.logs) {
        setLogs(prev => [...prev, ...result.logs]);
      }
      
      setTestResults(result);
      
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error running Selenium test:", error);
      
      // Add error log
      const errorLog: LogEntry = {
        id: `log-${Date.now() + 2}`,
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

      <Section title="Service Statistics" description="Real-time Selenium service metrics">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="CPU Usage"
            value={`${stats?.cpuUsage.toFixed(1)}%`}
            chartData={cpuData.data}
          />
          <StatCard
            title="Memory Usage"
            value={`${stats?.memoryUsage.toFixed(0)} MB`}
            chartData={memoryData.data}
          />
          <StatCard
            title="Active Sessions"
            value={stats?.activeConnections.toString() || "0"}
            chartData={getChartData(20, 10, 0)}
          />
          <StatCard
            title="Success Rate"
            value={`${stats?.successRate.toFixed(2)}%`}
            chartData={getChartData(20, 100, 80)}
          />
        </div>
      </Section>

      <Section title="Run Selenium Test" description="Execute browser automation and testing">
        <Card className="glass-morphism border border-purple-900/30">
          <CardContent className="p-6">
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="url">Simple URL Test</TabsTrigger>
                <TabsTrigger value="script">Custom Script Test</TabsTrigger>
              </TabsList>
              
              <TabsContent value="url" className="space-y-4">
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
                </div>
                
                <Button 
                  onClick={handleRunTest}
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
              </TabsContent>
              
              <TabsContent value="script" className="space-y-4">
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => setScript(sampleScript)}
                    >
                      <Code size={12} className="mr-1" />
                      Load Sample
                    </Button>
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
                </div>
                
                <Button 
                  onClick={handleRunTest}
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </Section>

      {testResults && (
        <Section title="Test Results" description="Results from the last Selenium test run">
          <Card className="glass-morphism border border-purple-900/30">
            <CardContent className="p-6">
              <div className="space-y-4">
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
              </div>
            </CardContent>
          </Card>
        </Section>
      )}

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
