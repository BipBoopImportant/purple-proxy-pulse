
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Globe, RotateCw, Database, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import Section from "@/components/ui/section";
import StatCard from "@/components/ui/stat-card";
import LogTerminal, { LogEntry } from "@/components/ui/log-terminal";
import { getServiceStats, getChartData, getServiceLogs, testProxy, getStoredProxies, testAllProxies, ProxyInfo } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  AreaChart, 
  Area, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const ProxyService = () => {
  const { toast } = useToast();
  const [proxyUrl, setProxyUrl] = useState<string>("");
  const [isTestingProxy, setIsTestingProxy] = useState<boolean>(false);
  const [isTestingAllProxies, setIsTestingAllProxies] = useState<boolean>(false);
  const [testAllResults, setTestAllResults] = useState<any>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Fetch service stats
  const { data: stats } = useQuery({
    queryKey: ["serviceStats", "proxy"],
    queryFn: () => getServiceStats("proxy"),
    refetchInterval: 5000,
  });
  
  // Fetch stored proxies
  const { data: storedProxies, isLoading: isLoadingProxies, refetch: refetchProxies } = useQuery({
    queryKey: ["storedProxies"],
    queryFn: getStoredProxies,
  });
  
  // Generate chart data
  const requestsData = useQuery({
    queryKey: ["chartData", "proxy", "requests"],
    queryFn: () => getChartData(24, 200, 50),
    refetchInterval: 60000,
  });
  
  const latencyData = useQuery({
    queryKey: ["chartData", "proxy", "latency"],
    queryFn: () => getChartData(24, 300, 50),
    refetchInterval: 60000,
  });
  
  // Fetch logs
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Initial logs
    setLogs(getServiceLogs("proxy", 15));
    
    // Simulate new logs coming in
    interval = setInterval(() => {
      const newLog = getServiceLogs("proxy", 1)[0];
      setLogs(prev => [...prev.slice(-99), newLog]);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleTestProxy = async () => {
    if (!proxyUrl) {
      toast({
        title: "Error",
        description: "Please enter a proxy URL",
        variant: "destructive",
      });
      return;
    }
    
    setIsTestingProxy(true);
    try {
      // Add a log for the test start
      const startLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        level: "info",
        service: "Proxy",
        message: `Testing proxy: ${proxyUrl}`,
      };
      setLogs(prev => [...prev, startLog]);
      
      const result = await testProxy(proxyUrl);
      
      // Add result log
      const resultLog: LogEntry = {
        id: `log-${Date.now() + 1}`,
        timestamp: new Date(),
        level: result.success ? "success" : "error",
        service: "Proxy",
        message: result.message + (result.latency ? ` (${result.latency}ms)` : ""),
      };
      setLogs(prev => [...prev, resultLog]);
      
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error testing proxy:", error);
      
      // Add error log
      const errorLog: LogEntry = {
        id: `log-${Date.now() + 2}`,
        timestamp: new Date(),
        level: "error",
        service: "Proxy",
        message: "An unexpected error occurred while testing the proxy",
      };
      setLogs(prev => [...prev, errorLog]);
      
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsTestingProxy(false);
    }
  };
  
  const handleTestAllProxies = async () => {
    setIsTestingAllProxies(true);
    setTestAllResults(null);
    
    try {
      // Add a log for the test start
      const startLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        level: "info",
        service: "Proxy",
        message: `Testing all stored proxies (${storedProxies?.length || 0} proxies)`
      };
      setLogs(prev => [...prev, startLog]);
      
      const results = await testAllProxies();
      setTestAllResults(results);
      
      // Add result logs
      const successLog: LogEntry = {
        id: `log-${Date.now() + 1}`,
        timestamp: new Date(),
        level: "success",
        service: "Proxy",
        message: `Completed testing ${results.total} proxies. Success: ${results.success}, Failed: ${results.failed}`
      };
      setLogs(prev => [...prev, successLog]);
      
      // Add individual result logs for failed proxies
      results.results.filter(r => !r.success).forEach((result, index) => {
        const failedLog: LogEntry = {
          id: `log-${Date.now() + 2 + index}`,
          timestamp: new Date(),
          level: "error",
          service: "Proxy",
          message: `Proxy #${result.id} failed: ${result.message}`
        };
        setLogs(prev => [...prev, failedLog]);
      });
      
      toast({
        title: "Proxy Test Completed",
        description: `Tested ${results.total} proxies. ${results.success} succeeded, ${results.failed} failed.`,
      });
    } catch (error) {
      console.error("Error testing all proxies:", error);
      
      // Add error log
      const errorLog: LogEntry = {
        id: `log-${Date.now() + 100}`,
        timestamp: new Date(),
        level: "error",
        service: "Proxy",
        message: "An unexpected error occurred while testing proxies"
      };
      setLogs(prev => [...prev, errorLog]);
      
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsTestingAllProxies(false);
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
          Proxy Service
        </motion.h1>
        <motion.p 
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Manage and test proxies for web scraping
        </motion.p>
      </Section>

      <Section title="Service Statistics" description="Real-time proxy service metrics">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="CPU Usage"
            value={`${stats?.cpuUsage.toFixed(1)}%`}
            chartData={getChartData(20, 100, 10)}
          />
          <StatCard
            title="Memory Usage"
            value={`${stats?.memoryUsage.toFixed(0)} MB`}
            chartData={getChartData(20, 1024, 256)}
          />
          <StatCard
            title="Active Connections"
            value={stats?.activeConnections.toString() || "0"}
            chartData={getChartData(20, 100, 5)}
          />
          <StatCard
            title="Success Rate"
            value={`${stats?.successRate.toFixed(2)}%`}
            chartData={getChartData(20, 100, 90)}
          />
        </div>
      </Section>

      <Section title="Test Proxy" description="Validate and test a proxy server">
        <Card className="glass-morphism border border-purple-900/30">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="proxy-url">Proxy URL</Label>
                    <Input
                      id="proxy-url"
                      placeholder="http://proxy.example.com:8080"
                      value={proxyUrl}
                      onChange={(e) => setProxyUrl(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={handleTestProxy}
                      disabled={isTestingProxy}
                      className="relative overflow-hidden group"
                    >
                      {isTestingProxy ? (
                        <>
                          <RotateCw size={16} className="mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Globe size={16} className="mr-2" />
                          Test Proxy
                        </>
                      )}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/10 to-purple-500/20 transform transition-transform duration-300 ease-out -translate-x-full group-hover:translate-x-0"></span>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={handleTestAllProxies}
                      disabled={isTestingAllProxies || !storedProxies || storedProxies.length === 0}
                      className="relative overflow-hidden group"
                    >
                      {isTestingAllProxies ? (
                        <>
                          <RotateCw size={16} className="mr-2 animate-spin" />
                          Testing All...
                        </>
                      ) : (
                        <>
                          <Database size={16} className="mr-2" />
                          Test All Stored Proxies
                        </>
                      )}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/10 to-purple-500/20 transform transition-transform duration-300 ease-out -translate-x-full group-hover:translate-x-0"></span>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 backdrop-blur-sm">
                <h3 className="text-sm font-medium mb-2">Proxy Format Examples:</h3>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• http://username:password@hostname:port</li>
                  <li>• http://hostname:port</li>
                  <li>• socks5://hostname:port</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      {storedProxies && storedProxies.length > 0 && (
        <Section title="Stored Proxies" description="Proxies stored in the database">
          <Card className="glass-morphism border border-purple-900/30">
            <CardContent className="p-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Proxy URL</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Response Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {storedProxies.map((proxy) => {
                      // Check if this proxy was tested in the last test all operation
                      const testResult = testAllResults?.results.find(
                        (r: any) => r.id === proxy.id
                      );
                      
                      return (
                        <TableRow key={proxy.id}>
                          <TableCell className="font-medium">{proxy.url}</TableCell>
                          <TableCell>{proxy.type}</TableCell>
                          <TableCell>{proxy.location || "Unknown"}</TableCell>
                          <TableCell className="text-center">
                            {testResult ? (
                              testResult.success ? (
                                <Badge className="bg-green-600/70">Operational</Badge>
                              ) : (
                                <Badge className="bg-red-600/70">Failed</Badge>
                              )
                            ) : (
                              <Badge 
                                className={
                                  proxy.status === "active" 
                                    ? "bg-green-600/70" 
                                    : "bg-red-600/70"
                                }
                              >
                                {proxy.status === "active" ? "Active" : "Inactive"}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {testResult?.latency ? `${testResult.latency}ms` : (proxy.responseTime ? `${proxy.responseTime}ms` : "-")}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              {testAllResults && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      Test Results: 
                      <span className="ml-1 text-green-500">{testAllResults.success} successful</span>
                      <span className="mx-1">/</span>
                      <span className="text-red-500">{testAllResults.failed} failed</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                  <Progress 
                    value={(testAllResults.success / testAllResults.total) * 100} 
                    className="h-2 bg-gray-700"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </Section>
      )}
      
      <Section title="Performance Metrics" description="Proxy service performance over time">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-morphism border border-purple-900/30 overflow-hidden">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-4">Requests per Minute</h3>
              <div className="h-[250px]">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >
                  {requestsData.data && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={requestsData.data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="timestamp" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#8884d8" 
                          fillOpacity={1} 
                          fill="url(#colorRequests)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </motion.div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border border-purple-900/30 overflow-hidden">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-4">Response Latency (ms)</h3>
              <div className="h-[250px]">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-full h-full"
                >
                  {latencyData.data && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={latencyData.data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="timestamp" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444" }} />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#82ca9d" 
                          fillOpacity={1} 
                          fill="url(#colorLatency)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Service Logs" description="Real-time logs from the proxy service">
        <LogTerminal
          logs={logs}
          title="Proxy Service Logs"
          height="h-[400px]"
        />
      </Section>
    </div>
  );
};

export default ProxyService;
