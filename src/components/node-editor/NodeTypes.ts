
// NodeTypes.ts - Defines the node types and interfaces for the editor

export interface NodeData {
  label?: string;
  type?: string;
  code?: string;
  operation?: string;
  field?: string;
  value?: string;
  url?: string;
  selector?: string;
  wait?: number;
  elementType?: string;
  options?: string[];
  timeout?: number;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: string;
  animated?: boolean;
  style?: Record<string, any>;
  markerEnd?: any;
  label?: string;
}

export interface CustomNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: NodeData;
  sourcePosition?: string;
  targetPosition?: string;
}

export enum NodeTypes {
  START = 'start',
  NAVIGATE = 'navigate',
  CLICK = 'click',
  TYPE = 'type',
  SELECT = 'select',
  WAIT = 'wait',
  SCREENSHOT = 'screenshot',
  EXTRACT = 'extract',
  CONDITION = 'condition',
  CODE = 'code',
  END = 'end'
}

export const NODE_COLORS = {
  [NodeTypes.START]: '#4CAF50',
  [NodeTypes.NAVIGATE]: '#2196F3',
  [NodeTypes.CLICK]: '#FF9800',
  [NodeTypes.TYPE]: '#9C27B0',
  [NodeTypes.SELECT]: '#00BCD4',
  [NodeTypes.WAIT]: '#607D8B',
  [NodeTypes.SCREENSHOT]: '#E91E63',
  [NodeTypes.EXTRACT]: '#673AB7',
  [NodeTypes.CONDITION]: '#FF5722',
  [NodeTypes.CODE]: '#795548',
  [NodeTypes.END]: '#F44336',
};

export const NODE_DESCRIPTIONS = {
  [NodeTypes.START]: 'Start the Selenium script',
  [NodeTypes.NAVIGATE]: 'Navigate to a URL',
  [NodeTypes.CLICK]: 'Click on an element',
  [NodeTypes.TYPE]: 'Type text into an input',
  [NodeTypes.SELECT]: 'Select from a dropdown',
  [NodeTypes.WAIT]: 'Wait for an element or time',
  [NodeTypes.SCREENSHOT]: 'Take a screenshot',
  [NodeTypes.EXTRACT]: 'Extract data from the page',
  [NodeTypes.CONDITION]: 'Conditional branching',
  [NodeTypes.CODE]: 'Custom JavaScript code',
  [NodeTypes.END]: 'End the Selenium script',
};

export const generateNodeCode = (node: CustomNode, nodeType: NodeTypes): string => {
  switch (nodeType) {
    case NodeTypes.START:
      return '// Start the Selenium script\n';
    case NodeTypes.NAVIGATE:
      return `await driver.get("${node.data.url}");\n`;
    case NodeTypes.CLICK:
      return `await driver.findElement(By.css("${node.data.selector}")).click();\n`;
    case NodeTypes.TYPE:
      return `await driver.findElement(By.css("${node.data.selector}")).sendKeys("${node.data.value}");\n`;
    case NodeTypes.SELECT:
      return `
const selectElement = await driver.findElement(By.css("${node.data.selector}"));
const select = new Select(selectElement);
await select.selectByVisibleText("${node.data.value}");\n`;
    case NodeTypes.WAIT:
      if (node.data.elementType === 'time') {
        return `await driver.sleep(${node.data.wait});\n`;
      } else {
        return `await driver.wait(until.elementLocated(By.css("${node.data.selector}")), ${node.data.timeout || 10000});\n`;
      }
    case NodeTypes.SCREENSHOT:
      return `await driver.takeScreenshot();\n`;
    case NodeTypes.EXTRACT:
      return `
const element = await driver.findElement(By.css("${node.data.selector}"));
const extractedValue = await element.getText();
console.log("Extracted value:", extractedValue);\n`;
    case NodeTypes.CONDITION:
      return `
try {
  const element = await driver.findElement(By.css("${node.data.selector}"));
  const isDisplayed = await element.isDisplayed();
  if (isDisplayed) {
    // Continue with "true" path
  } else {
    // Continue with "false" path
  }
} catch (error) {
  // Continue with "false" path
}\n`;
    case NodeTypes.CODE:
      return node.data.code || '// Custom code\n';
    case NodeTypes.END:
      return '// End of Selenium script\n';
    default:
      return '';
  }
};
