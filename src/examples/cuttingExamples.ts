/**
 * Example usage of the cutting optimizer in different environments
 * These examples show how the pure functions can be used anywhere
 */

import { 
  optimizeCuttingBLF, 
  defaultCuttingConfig, 
  silentLogger,
  expandPartsByQuantity,
  sortPartsByArea,
  type CuttingConfig 
} from '../utils/cuttingOptimizer';
import type { Part } from '../types/simple';

// Example 1: Basic usage with default settings
export const basicExample = () => {
  const parts: Part[] = [
    { id: '1', width: 500, height: 600, quantity: 1, label: 'Large panel' },
    { id: '2', width: 200, height: 300, quantity: 2, label: 'Small panel' },
    { id: '3', width: 400, height: 250, quantity: 1, label: 'Medium panel' }
  ];

  const result = optimizeCuttingBLF(parts);
  
  console.log('Basic example result:', {
    totalSheets: result.totalSheets,
    efficiency: `${(result.overallEfficiency * 100).toFixed(1)}%`
  });

  return result;
};

// Example 2: Custom configuration for different material sizes
export const customSheetSizeExample = () => {
  const parts: Part[] = [
    { id: '1', width: 1200, height: 800, quantity: 1 },
    { id: '2', width: 600, height: 400, quantity: 2 }
  ];

  const customConfig: CuttingConfig = {
    sheetWidth: 2440,  // Different sheet size
    sheetHeight: 1220,
    gap: 3,           // Larger gap for this material
    stepSize: 5,      // Finer positioning
    enableLogging: true
  };

  return optimizeCuttingBLF(parts, customConfig);
};

// Example 3: Silent operation for production/API usage
export const silentProductionExample = (parts: Part[]) => {
  const productionConfig: CuttingConfig = {
    ...defaultCuttingConfig,
    enableLogging: false
  };

  return optimizeCuttingBLF(parts, productionConfig, silentLogger);
};

// Example 4: Node.js/Server usage
export const serverSideExample = async (partsFromDatabase: Part[]) => {
  // This could be called from an API endpoint
  const config: CuttingConfig = {
    sheetWidth: 2800,
    sheetHeight: 2070,
    gap: 2,
    stepSize: 10,
    enableLogging: false // No console output on server
  };

  const result = optimizeCuttingBLF(partsFromDatabase, config, silentLogger);
  
  // Could save to database, send as JSON response, etc.
  return {
    success: true,
    data: {
      sheets: result.sheets.length,
      efficiency: Math.round(result.overallEfficiency * 100),
      layout: result.sheets
    }
  };
};

// Example 5: Unit testing friendly
export const testableExample = (parts: Part[], expectedSheets: number) => {
  const result = optimizeCuttingBLF(parts, defaultCuttingConfig, silentLogger);
  
  return {
    passed: result.totalSheets === expectedSheets,
    actual: result.totalSheets,
    expected: expectedSheets,
    efficiency: result.overallEfficiency
  };
};

// Example 6: Using individual functions for custom logic
export const customLogicExample = (parts: Part[]) => {
  // Step 1: Use individual functions for preprocessing
  const expandedParts = expandPartsByQuantity(parts);
  const sortedParts = sortPartsByArea(expandedParts);
  
  // Step 2: Apply custom business logic
  const filteredParts = sortedParts.filter(part => 
    Number(part.width) <= 2000 && Number(part.height) <= 1500
  );
  
  // Step 3: Run optimization on filtered parts
  const result = optimizeCuttingBLF(filteredParts, {
    ...defaultCuttingConfig,
    gap: 5 // Custom gap for these parts
  });
  
  // Step 4: Calculate custom metrics
  const wastePercentage = 100 - (result.overallEfficiency * 100);
  
  return {
    ...result,
    wastePercentage,
    filteredOutParts: parts.length - filteredParts.length
  };
};

// Example 7: CLI tool usage
export const cliToolExample = (args: string[]) => {
  // Parse command line arguments
  const width = parseInt(args[0]) || 2800;
  const height = parseInt(args[1]) || 2070;
  const gap = parseInt(args[2]) || 1;
  
  // Example parts (in real CLI, these would come from file input)
  const parts: Part[] = [
    { id: '1', width: 400, height: 300, quantity: 3 },
    { id: '2', width: 600, height: 500, quantity: 2 }
  ];
  
  const config: CuttingConfig = {
    sheetWidth: width,
    sheetHeight: height,
    gap,
    stepSize: 10,
    enableLogging: true
  };
  
  const result = optimizeCuttingBLF(parts, config);
  
  // CLI output
  console.log(`\nCutting Plan Generated:`);
  console.log(`- Sheets needed: ${result.totalSheets}`);
  console.log(`- Material efficiency: ${(result.overallEfficiency * 100).toFixed(1)}%`);
  console.log(`- Total parts: ${result.sheets.reduce((sum, sheet) => sum + sheet.placedParts.length, 0)}`);
  
  return result;
};

// Example 8: Web Worker usage
export const webWorkerExample = (partsData: string) => {
  // This could run in a Web Worker for heavy calculations
  const parts: Part[] = JSON.parse(partsData);
  
  const result = optimizeCuttingBLF(parts, defaultCuttingConfig, {
    log: (msg) => self.postMessage({ type: 'log', message: msg }),
    warn: (msg) => self.postMessage({ type: 'warn', message: msg })
  });
  
  // Post result back to main thread
  self.postMessage({ type: 'result', data: result });
  
  return result;
};
