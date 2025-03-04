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

export type ProxyInfo = {
  id: string;
  url: string;
  type: "http" | "https" | "socks4" | "socks5";
  username?: string;
  password?: string;
  location?: string;
  lastChecked?: Date;
  status: "active" | "inactive";
  responseTime?: number;
  successRate?: number;
};

export type SeleniumScript = {
  id: string;
  name: string;
  description: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  tags: string[];
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

// Mock function to get all stored proxies
export const getStoredProxies = async (): Promise<ProxyInfo[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: "proxy-1",
      url: "http://proxy1.example.com:8080",
      type: "http",
      location: "United States",
      lastChecked: new Date(Date.now() - 3600000), // 1 hour ago
      status: "active",
      responseTime: 120,
      successRate: 98.5,
    },
    {
      id: "proxy-2",
      url: "https://proxy2.example.com:443",
      type: "https",
      username: "user",
      password: "pass",
      location: "Germany",
      lastChecked: new Date(Date.now() - 7200000), // 2 hours ago
      status: "active",
      responseTime: 210,
      successRate: 97.2,
    },
    {
      id: "proxy-3",
      url: "socks5://proxy3.example.com:1080",
      type: "socks5",
      location: "Japan",
      lastChecked: new Date(Date.now() - 10800000), // 3 hours ago
      status: "inactive",
      responseTime: 350,
      successRate: 85.3,
    },
  ];
};

// Mock function to test all proxies
export const testAllProxies = async (): Promise<{
  total: number;
  success: number;
  failed: number;
  results: { id: string; success: boolean; message: string; latency?: number }[];
}> => {
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const proxies = await getStoredProxies();
  
  const results = proxies.map(proxy => {
    const success = Math.random() > 0.3;
    return {
      id: proxy.id,
      success,
      message: success ? "Connection successful" : "Connection failed: timeout",
      latency: success ? Math.floor(Math.random() * 300) + 50 : undefined,
    };
  });
  
  const successCount = results.filter(r => r.success).length;
  
  return {
    total: proxies.length,
    success: successCount,
    failed: proxies.length - successCount,
    results,
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
  aiAnalysis?: any;
}> => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const random = Math.random();
  if (random > 0.7) {
    return {
      success: false,
      message: "Selenium test failed: timeout waiting for element",
    };
  }
  
  if (options.forwardToAI) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      message: "Selenium test completed successfully with AI analysis",
      screenshots: [
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      ],
      logs: getServiceLogs("selenium", 5),
      aiAnalysis: {
        pageTitle: "Login Form",
        url: url,
        detectedType: "Authentication Form",
        securityFeatures: ["CSRF Protection", "Password Strength Indicator"],
        accessibilityScore: 85,
        suggestedActions: [
          "Implement captcha to prevent automated submissions",
          "Add 'forgot password' functionality",
          "Improve form field labeling for screen readers"
        ],
        detectedElements: {
          inputs: ["username", "password", "remember"],
          buttons: ["login", "reset"],
          links: ["signup", "forgot-password"]
        }
      }
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

// Mock function to get stored Selenium scripts
export const getStoredScripts = async (): Promise<SeleniumScript[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    {
      id: "script-1",
      name: "Login Form Test",
      description: "Tests login functionality with valid credentials",
      code: `// Login Form Test
await driver.get(url);
const usernameField = await driver.findElement(By.id('username'));
const passwordField = await driver.findElement(By.id('password'));
const submitButton = await driver.findElement(By.css('button[type="submit"]'));

await usernameField.sendKeys('testuser');
await passwordField.sendKeys('password123');
await submitButton.click();

// Wait for dashboard to load
await driver.wait(until.elementLocated(By.id('dashboard')), 5000);`,
      createdAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
      updatedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
      author: "admin",
      tags: ["login", "authentication"]
    },
    {
      id: "script-2",
      name: "Product Search Test",
      description: "Tests search functionality and results",
      code: `// Product Search Test
await driver.get(url);
const searchField = await driver.findElement(By.name('q'));
await searchField.sendKeys('test product');
await searchField.submit();

// Wait for search results
await driver.wait(until.elementLocated(By.css('.search-results')), 5000);
const results = await driver.findElements(By.css('.product-item'));
console.log(\`Found \${results.length} search results\`);`,
      createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
      updatedAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
      author: "tester",
      tags: ["search", "products"]
    },
    {
      id: "script-3",
      name: "Checkout Flow Test",
      description: "Tests the checkout process from cart to order confirmation",
      code: `// Checkout Flow Test
await driver.get(url + '/cart');
const checkoutButton = await driver.findElement(By.id('checkout-button'));
await checkoutButton.click();

// Fill shipping details
await driver.wait(until.elementLocated(By.id('shipping-form')), 5000);
await driver.findElement(By.id('name')).sendKeys('Test User');
await driver.findElement(By.id('address')).sendKeys('123 Test St');
await driver.findElement(By.id('city')).sendKeys('Testville');
await driver.findElement(By.id('zip')).sendKeys('12345');

// Continue to payment
await driver.findElement(By.id('continue-button')).click();

// Fill payment details
await driver.wait(until.elementLocated(By.id('payment-form')), 5000);
await driver.findElement(By.id('card-number')).sendKeys('4111111111111111');
await driver.findElement(By.id('card-expiry')).sendKeys('1224');
await driver.findElement(By.id('card-cvc')).sendKeys('123');

// Place order
await driver.findElement(By.id('place-order-button')).click();

// Verify confirmation
await driver.wait(until.elementLocated(By.id('order-confirmation')), 8000);`,
      createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
      updatedAt: new Date(Date.now() - 86400000), // 1 day ago
      author: "admin",
      tags: ["checkout", "payment", "order"]
    }
  ];
};

// Mock function to analyze a webpage with AI
export const analyzeWebpage = async (
  url: string,
  prompt?: string
): Promise<{
  success: boolean;
  message: string;
  analysis?: {
    title: string;
    description: string;
    fields: { name: string; type: string; required: boolean }[];
    aiInsights?: string[];
    promptResponse?: string;
  };
}> => {
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  const random = Math.random();
  if (random > 0.9) {
    return {
      success: false,
      message: "Failed to analyze webpage: timeout",
    };
  }
  
  const baseAnalysis = {
    title: "Login Form",
    description: "Standard login form with username and password fields",
    fields: [
      { name: "username", type: "text", required: true },
      { name: "password", type: "password", required: true },
      { name: "remember", type: "checkbox", required: false },
    ]
  };
  
  if (prompt) {
    return {
      success: true,
      message: "Webpage analyzed successfully with custom prompt",
      analysis: {
        ...baseAnalysis,
        aiInsights: [
          "Form uses client-side validation for username format",
          "Password field has minimum length requirement",
          "No CSRF token detected in the form"
        ],
        promptResponse: `Specific analysis based on prompt "${prompt}": This login form uses standard authentication patterns with minimal security features. The form lacks advanced protection mechanisms like CAPTCHA or two-factor authentication options.`
      }
    };
  }
  
  return {
    success: true,
    message: "Webpage analyzed successfully",
    analysis: baseAnalysis
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
