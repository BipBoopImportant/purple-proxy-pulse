
import { Edge, Node } from '@xyflow/react';
import { NodeTypes, generateNodeCode, CustomNode } from '../NodeTypes';

// Generate Selenium script from nodes
export const generateScript = (nodes: Node[], edges: Edge[]): string => {
  // Sort nodes based on connections/edges
  const sortedNodes: Node[] = [];
  const visited = new Set<string>();
  const nodeMap = new Map<string, Node>();
  
  // Create a map of node id to node
  nodes.forEach(node => {
    nodeMap.set(node.id, node);
  });
  
  // Start with the start node
  const startNode = nodes.find(node => node.type === NodeTypes.START);
  if (!startNode) {
    return '';
  }
  
  // Use DFS to traverse the graph
  const dfs = (nodeId: string) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    
    const node = nodeMap.get(nodeId);
    if (node) {
      sortedNodes.push(node);
      
      // Find outgoing edges from this node
      const outgoingEdges = edges.filter(edge => edge.source === nodeId);
      outgoingEdges.forEach(edge => {
        if (edge.target) {
          dfs(edge.target);
        }
      });
    }
  };
  
  // Start DFS from the start node
  dfs(startNode.id);
  
  // Generate code from sorted nodes
  let script = '// Generated Selenium script\n\n';
  
  // Add setup code
  script += `// Setup
const { Builder, By, Key, until, Select } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function runTest() {
  let driver;
  
  try {
    // Set up Chrome options
    const options = new chrome.Options();
    options.addArguments('--headless');
    
    // Build the driver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
      
    // Set implicit wait
    await driver.manage().setTimeouts({ implicit: 10000 });
    
    // Test script begins
`;
  
  // Add code for each node
  sortedNodes.forEach(node => {
    if (node.type && node.type in NodeTypes) {
      script += '    ' + generateNodeCode(node as CustomNode, node.type as NodeTypes).split('\n').join('\n    ');
    }
  });
  
  // Add cleanup code
  script += `
    // Test script ends
    
    console.log('Test completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Test failed:', error);
    return { success: false, error: error.message };
  } finally {
    // Cleanup
    if (driver) {
      await driver.quit();
    }
  }
})();
`;
  
  return script;
};

// Function to create a run-ready script with headless mode toggle
export const generateExecutableScript = (nodes: Node[], edges: Edge[], isHeadless: boolean = true): string => {
  const script = generateScript(nodes, edges);
  
  // If headless is false, modify the script
  if (!isHeadless) {
    return script.replace("options.addArguments('--headless');", "// options.addArguments('--headless');");
  }
  
  return script;
};
