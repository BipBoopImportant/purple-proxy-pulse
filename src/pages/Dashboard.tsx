
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, ArrowRight, Cpu, Database, Globe, Server } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Section from "@/components/ui/section";
import StatCard from "@/components/ui/stat-card";
import LogTerminal, { LogEntry } from "@/components/ui/log-terminal";
import { getServices, getServiceStats, getChartData, getLogs, Service } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${days}d ${hours}h ${minutes}m`;
};

const Dashboard = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Fetch services data
  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
  // Fetch combined stats for all services
  const { data: stats } = useQuery({
    queryKey: ["serviceStats", "all"],
    queryFn: () => getServiceStats("all"),
    refetchInterval: 5000, // Refetch every 5 seconds
  });
  
  // Generate chart data for services
  const requestData = useQuery({
    queryKey: ["chartData", "requests"],
    queryFn: () => getChartData(24, 200, 50),
    refetchInterval: 60000, // Refetch every minute
  });
  
  const cpuData = useQuery({
    queryKey: ["chartData", "cpu"],
    queryFn: () => getChartData(24, 100, 10),
    refetchInterval: 60000,
  });
  
  const memoryData = useQuery({
    queryKey: ["chartData", "memory"],
    queryFn: () => getChartData(24, 1024, 256),
    refetchInterval: 60000,
  });
  
  // Fetch logs
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Initial logs
    setLogs(getLogs(15));
    
    // Simulate new logs coming in
    interval = setInterval(() => {
      const newLog = getLogs(1)[0];
      setLogs(prev => [...prev.slice(-99), newLog]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="space-y-8">
      <Section>
        <motion.h1 
          className="text-3xl font-semibold tracking-tight mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          System Dashboard
        </motion.h1>
        <motion.p 
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Monitor and control all your services from a single interface
        </motion.p>
      </Section>

      <Section title="Service Status" description="Current status of all services">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service: Service, index: number) => (
            <StatCard
              key={service.id}
              title={service.name}
              value={service.status === "online" ? "Online" : service.status}
              description={`Uptime: ${formatUptime(service.uptime)}`}
              icon={
                service.id === "proxy" ? <Globe size={18} /> :
                service.id === "selenium" ? <Server size={18} /> :
                service.id === "ai" ? <Cpu size={18} /> :
                <Database size={18} />
              }
              chartData={getChartData(20, 100, 80)}
              lineColor={
                service.status === "online" ? "#10b981" :
                service.status === "warning" ? "#f59e0b" :
                "#ef4444"
              }
              valueColor={
                service.status === "online" ? "text-green-500" :
                service.status === "warning" ? "text-yellow-500" :
                "text-red-500"
              }
              action={
                <div className="text-xs text-muted-foreground hover:text-purple-400 transition-colors mt-2 flex items-center justify-end gap-1">
                  <a href={`/${service.id}`} className="flex items-center">
                    View details <ArrowRight size={14} className="ml-1" />
                  </a>
                </div>
              }
            />
          ))}
        </div>
      </Section>

      <Section title="System Performance" description="Real-time performance metrics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total Requests"
            value={services.reduce((acc, service) => acc + service.requests, 0).toLocaleString()}
            icon={<Activity size={18} />}
            chartData={requestData.data}
          />
          <StatCard
            title="Average Latency"
            value={`${Math.round(
              services.reduce((acc, service) => acc + service.latency, 0) / services.length
            )} ms`}
            icon={<Activity size={18} />}
            chartData={cpuData.data}
          />
          <StatCard
            title="Success Rate"
            value={`${(
              (1 - services.reduce((acc, service) => acc + service.failures, 0) /
              services.reduce((acc, service) => acc + service.requests, 0)) * 100
            ).toFixed(2)}%`}
            icon={<Activity size={18} />}
            chartData={memoryData.data}
          />
        </div>
        
        <Card className="glass-morphism border border-purple-900/30">
          <CardContent className="p-4">
            <Tabs defaultValue="requests" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="requests">Requests</TabsTrigger>
                <TabsTrigger value="cpu">CPU Usage</TabsTrigger>
                <TabsTrigger value="memory">Memory Usage</TabsTrigger>
              </TabsList>
              
              <TabsContent value="requests" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={requestData.data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="timestamp" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(0, 0, 0, 0.8)", 
                        border: "1px solid #444",
                        borderRadius: "8px",
                        color: "#fff" 
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Requests" 
                      stroke="#8884d8" 
                      strokeWidth={2} 
                      dot={{ r: 2 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="cpu" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={cpuData.data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="timestamp" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(0, 0, 0, 0.8)", 
                        border: "1px solid #444",
                        borderRadius: "8px",
                        color: "#fff" 
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="CPU Usage %" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                      dot={{ r: 2 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="memory" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={memoryData.data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="timestamp" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(0, 0, 0, 0.8)", 
                        border: "1px solid #444",
                        borderRadius: "8px",
                        color: "#fff" 
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Memory (MB)" 
                      stroke="#f59e0b" 
                      strokeWidth={2} 
                      dot={{ r: 2 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </Section>

      <Section title="System Logs" description="Real-time logs from all services">
        <LogTerminal
          logs={logs}
          serviceTabs={["Proxy", "Selenium", "AI Model", "CORS Proxy", "System"]}
          height="h-[400px]"
        />
      </Section>
    </div>
  );
};

export default Dashboard;
