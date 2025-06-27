/**
 * Performance monitoring utilities for the cutting configurator
 */

let performanceMode = false;

export const enablePerformanceLogging = () => {
  performanceMode = true;
  console.log('🚀 Performance logging enabled');
};

export const disablePerformanceLogging = () => {
  performanceMode = false;
  console.log('📊 Performance logging disabled');
};

export const logRenderTime = (componentName: string, startTime: number) => {
  if (performanceMode) {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (renderTime > 5) { // Only log renders that take more than 5ms
      console.log(`⏱️ ${componentName} render: ${renderTime.toFixed(2)}ms`);
    }
  }
};

export const logHeavyOperation = <T>(operationName: string, fn: () => T): T => {
  if (performanceMode) {
    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration > 1) { // Only log operations that take more than 1ms
      console.log(`🔄 ${operationName}: ${duration.toFixed(2)}ms`);
    }
    
    return result;
  } else {
    return fn();
  }
};

export const measureAsyncOperation = async <T>(operationName: string, fn: () => Promise<T>): Promise<T> => {
  if (performanceMode) {
    const startTime = performance.now();
    const result = await fn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`⚡ ${operationName}: ${duration.toFixed(2)}ms`);
    return result;
  } else {
    return await fn();
  }
};

// Export global performance controls for debugging
if (typeof window !== 'undefined') {
  (window as unknown as { enablePerformanceLogging: () => void; disablePerformanceLogging: () => void }).enablePerformanceLogging = enablePerformanceLogging;
  (window as unknown as { enablePerformanceLogging: () => void; disablePerformanceLogging: () => void }).disablePerformanceLogging = disablePerformanceLogging;
}
