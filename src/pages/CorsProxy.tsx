
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Share2, RotateCw } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import Section from "@/components/ui/section";
import StatCard from "@/components/ui/stat-card";
import LogTerminal, { LogEntry } from "@/components/ui/log-terminal";
import { getServiceStats, getChartData, getServiceLogs } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const CorsProxy = () => {
  const { toast } = useToast();
  const [targetUrl, setTargetUrl] = useState<string>("");
  const [isTestingUrl, setIsTestingUrl] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Fetch service stats
  const { data: stats } = useQuery({
    queryKey: ["serviceStats", "cors"],
    queryFn: () => getServiceStats("cors"),
    refetchInterval: 5000,
  });
  
  // Generate chart data
  const requestsData = useQuery({
    queryKey: ["chartData", "cors", "requests"],
    queryFn: () => getChartData(24, 150, 30),
    refetchInterval: 60000,
  });
  
  const latencyData = useQuery({
    queryKey: ["chartData", "cors", "latency"],
    queryFn: () => getChartData(24, 200, 40),
    refetchInterval: 60000,
  });
  
  // Fetch logs
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Initial logs
    setLogs(getServiceLogs("cors", 15));
    
    // Simulate new logs coming in
    interval = setInterval(() => {
      const newLog = getServiceLogs("cors", 1)[0];
      setLogs(prev => [...prev.slice(-99), newLog]);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleTestCorsProxy = async () => {
    if (!targetUrl) {
      toast({
        title: "Error",
        description: "Please enter a target URL",
        variant: "destructive",
      });
      return;
    }
    
    setIsTestingUrl(true);
    try {
      // Add a log for the test start
      const startLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        level: "info",
        service: "CORS Proxy",
        message: `Testing CORS proxy with URL: ${targetUrl}`,
      };
      setLogs(prev => [...prev, startLog]);
      
      // Simulate test result
      await new Promise(resolve => setTimeout(resolve, 1500));
      const success = Math.random() > 0.2; // 80% success rate
      
      // Add result log
      const resultLog: LogEntry = {
        id: `log-${Date.now() + 1}`,
        timestamp: new Date(),
        level: success ? "success" : "error",
        service: "CORS Proxy",
        message: success ? 
          `Successfully proxied request to ${targetUrl}` :
          `Failed to proxy request: CORS policy violation or network error`,
      };
      setLogs(prev => [...prev, resultLog]);
      
      toast({
        title: success ? "Success" : "Error",
        description: success ? 
          "CORS proxy successfully bypassed restrictions" :
          "Failed to proxy the request",
        variant: success ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error testing CORS proxy:", error);
      
      // Add error log
      const errorLog: LogEntry = {
        id: `log-${Date.now() + 2}`,
        timestamp: new Date(),
        level: "error",
        service: "CORS Proxy",
        message: "An unexpected error occurred with the CORS proxy",
      };
      setLogs(prev => [...prev, errorLog]);
      
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsTestingUrl(false);
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
          CORS Proxy
        </motion.h1>
        <motion.p 
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Bypass CORS restrictions for API requests and web scraping
        </motion.p>
      </Section>

      <Section title="Service Statistics" description="Real-time CORS proxy metrics">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="CPU Usage"
            value={`${stats?.cpuUsage.toFixed(1)}%`}
            chartData={getChartData(20, 100, 10)}
          />
          <StatCard
            title="Memory Usage"
            value={`${stats?.memoryUsage.toFixed(0)} MB`}
            chartData={getChartData(20, 512, 128)}
          />
          <StatCard
            title="Active Connections"
            value={stats?.activeConnections.toString() || "0"}
            chartData={getChartData(20, 50, 5)}
          />
          <StatCard
            title="Success Rate"
            value={`${stats?.successRate.toFixed(2)}%`}
            chartData={getChartData(20, 100, 90)}
          />
        </div>
      </Section>

      <Section title="Test CORS Proxy" description="Verify cross-origin requests through the proxy">
        <Card className="glass-morphism border border-purple-900/30">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="target-url">Target URL</Label>
                    <Input
                      id="target-url"
                      placeholder="https://api.example.com/data"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleTestCorsProxy}
                    disabled={isTestingUrl}
                    className="relative overflow-hidden group"
                  >
                    {isTestingUrl ? (
                      <>
                        <RotateCw size={16} className="mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Share2 size={16} className="mr-2" />
                        Test CORS Proxy
                      </>
                    )}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/10 to-purple-500/20 transform transition-transform duration-300 ease-out -translate-x-full group-hover:translate-x-0"></span>
                  </Button>
                </div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 backdrop-blur-sm">
                <h3 className="text-sm font-medium mb-2">CORS Proxy Usage:</h3>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Use for accessing APIs with CORS restrictions</li>
                  <li>• Bypass browser security for web scraping</li>
                  <li>• Enable cross-origin requests in client-side code</li>
                  <li>• Format: https://your-proxy.com/proxy?url=TARGET_URL</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Service Logs" description="Real-time logs from the CORS proxy service">
        <LogTerminal
          logs={logs}
          title="CORS Proxy Logs"
          height="h-[400px]"
        />
      </Section>
    </div>
  );
};

export default CorsProxy;
