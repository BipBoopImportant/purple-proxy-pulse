
// This is a mock API service for demonstration purposes
// In a real application, this would connect to your backend services

import { LogEntry } from "@/components/ui/log-terminal";

export type ServiceStatus = "online" | "offline" | "error" | "warning";

export type Service = {
  id: string;
  name: string;
  status: ServiceStatus;
  uptime: number; // in seconds
  requests: number;
  failures: number;
  latency: number; // in ms
};

export type ServiceStats = {
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  requestsPerMinute: number[];
  responseTime: number[];
  successRate: number;
  timestamp: Date;
};

// Generate mock data for services
export const getServices = (): Service[] => {
  return [
    {
      id: "proxy",
      name: "Proxy Service",
      status: "online",
      uptime: 3600 * 24 * 3 + 3600 * 5, // 3 days and 5 hours
      requests: 15342,
      failures: 23,
      latency: 120,
    },
    {
      id: "selenium",
      name: "Selenium Instance",
      status: "online",
      uptime: 3600 * 24 * 2 + 3600 * 12, // 2 days and 12 hours
      requests: 8921,
      failures: 104,
      latency: 350,
    },
    {
      id: "ai",
      name: "AI Model",
      status: "online",
      uptime: 3600 * 24 * 5 + 3600 * 2, // 5 days and 2 hours
      requests: 4231,
      failures: 12,
      latency: 850,
    },
    {
      id: "cors",
      name: "CORS Proxy",
      status: "online",
      uptime: 3600 * 24 * 7, // 7 days
      requests: 28451,
      failures: 142,
      latency: 75,
    },
  ];
};

// Generate mock statistics data for a service
export const getServiceStats = (serviceId: string): ServiceStats => {
  const now = new Date();
  
  return {
    cpuUsage: Math.random() * 100,
    memoryUsage: Math.random() * 1024,
    activeConnections: Math.floor(Math.random() * 100),
    requestsPerMinute: Array.from({ length: 60 }, () => Math.floor(Math.random() * 100)),
    responseTime: Array.from({ length: 60 }, () => Math.floor(Math.random() * 500)),
    successRate: 90 + Math.random() * 10,
    timestamp: now,
  };
};

// Generate mock chart data
export const getChartData = (
  dataPoints: number = 24,
  max: number = 100,
  min: number = 10
) => {
  const now = new Date();
  
  return Array.from({ length: dataPoints }, (_, i) => {
    const value = min + Math.random() * (max - min);
    const date = new Date(now.getTime() - (dataPoints - i) * 3600000);
    return {
      value: Number(value.toFixed(2)),
      timestamp: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
    };
  });
};

// Generate mock logs
export const getLogs = (count: number = 20): LogEntry[] => {
  const services = ["Proxy", "Selenium", "AI Model", "CORS Proxy", "System"];
  const levels: Array<LogEntry["level"]> = ["info", "warning", "error", "success"];
  const messages = [
    "Server started",
    "New connection established",
    "Request processed successfully",
    "Connection timeout",
    "Failed to connect to remote server",
    "Authentication successful",
    "Invalid credentials provided",
    "Cache cleared",
    "Memory usage high",
    "CPU throttling detected",
    "Proxy connection established",
    "Selenium instance initialized",
    "AI model loaded successfully",
    "CORS headers added to response",
    "Request forwarded to origin server",
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - (count - i));
    
    const service = services[Math.floor(Math.random() * services.length)];
    const level = Math.random() > 0.7 
      ? levels[Math.floor(Math.random() * (levels.length - 1)) + 1] 
      : "info";
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    return {
      id: `log-${i}-${date.getTime()}`,
      timestamp: date,
      level,
      service,
      message,
    };
  });
};

// Get service-specific logs
export const getServiceLogs = (serviceId: string, count: number = 20): LogEntry[] => {
  const serviceName = serviceId === "proxy" 
    ? "Proxy" 
    : serviceId === "selenium" 
      ? "Selenium" 
      : serviceId === "ai" 
        ? "AI Model" 
        : serviceId === "cors" 
          ? "CORS Proxy" 
          : "System";
  
  const logs = getLogs(count);
  return logs.map(log => ({ ...log, service: serviceName }));
};

// Mock function to test a proxy
export const testProxy = async (url: string): Promise<{
  success: boolean;
  message: string;
  latency?: number;
}> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const random = Math.random();
  if (random > 0.8) {
    return {
      success: false,
      message: "Failed to connect to proxy",
    };
  }
  
  return {
    success: true,
    message: "Proxy test successful",
    latency: Math.floor(Math.random() * 200) + 50,
  };
};

// Mock function to run a Selenium test
export const runSeleniumTest = async (
  url: string,
  options: any
): Promise<{
  success: boolean;
  message: string;
  screenshots?: string[];
  logs?: LogEntry[];
}> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const random = Math.random();
  if (random > 0.7) {
    return {
      success: false,
      message: "Selenium test failed: timeout waiting for element",
    };
  }
  
  return {
    success: true,
    message: "Selenium test completed successfully",
    screenshots: [
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    ],
    logs: getServiceLogs("selenium", 5),
  };
};

// Mock function to analyze a webpage with AI
export const analyzeWebpage = async (
  url: string
): Promise<{
  success: boolean;
  message: string;
  analysis?: {
    title: string;
    description: string;
    fields: { name: string; type: string; required: boolean }[];
  };
}> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  const random = Math.random();
  if (random > 0.9) {
    return {
      success: false,
      message: "Failed to analyze webpage: timeout",
    };
  }
  
  return {
    success: true,
    message: "Webpage analyzed successfully",
    analysis: {
      title: "Login Form",
      description: "Standard login form with username and password fields",
      fields: [
        { name: "username", type: "text", required: true },
        { name: "password", type: "password", required: true },
        { name: "remember", type: "checkbox", required: false },
      ],
    },
  };
};

// Mock function to make a CORS request
export const makeCorsRequest = async (
  url: string,
  method: string = "GET",
  headers: Record<string, string> = {}
): Promise<{
  success: boolean;
  message: string;
  response?: any;
}> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const random = Math.random();
  if (random > 0.85) {
    return {
      success: false,
      message: "CORS request failed: target server unreachable",
    };
  }
  
  return {
    success: true,
    message: "CORS request completed successfully",
    response: {
      status: 200,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*",
      },
      body: {
        success: true,
        message: "This is a simulated response from the target server",
        timestamp: new Date().toISOString(),
      },
    },
  };
};
