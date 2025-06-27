import { useState, useCallback, useMemo } from 'react';
import type { Part, SheetLayout } from '../types/simple';
import { 
  optimizeCuttingBLF, 
  defaultCuttingConfig, 
  silentLogger,
  type CuttingConfig,
  type Logger
} from '../utils/cuttingOptimizer';
import { createPartWithStatus, updatePartWithStatus } from '../utils/partConfigurationStatus';

/**
 * React hook for cutting configuration with optimized performance
 * 
 * Performance Optimization:
 * - The cutting layout only recalculates when part dimensions, quantities, or IDs change
 * - Corner modifications (bevel, round) and edge treatments do NOT trigger recalculation
 * - This prevents unnecessary optimization runs when editing visual-only properties
 * - Uses silent logging by default to reduce console noise during development
 */
export const useSimpleConfigurator = (
  config: Partial<CuttingConfig> = {},
  logger: Logger = silentLogger
) => {
  const [parts, setParts] = useState<Part[]>([]);

  // Memoize the merged config to avoid dependency issues
  const cuttingConfig = useMemo((): CuttingConfig => ({
    ...defaultCuttingConfig,
    ...config
  }), [config]);

  const addPart = useCallback((partData: Omit<Part, 'id'>) => {
    const partWithStatus = createPartWithStatus(partData);
    const newPart: Part = {
      ...partWithStatus,
      id: `part-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setParts(prev => [...prev, newPart]);
  }, []);

  const updatePart = useCallback((id: string, updates: Partial<Part>) => {
    setParts(prev => prev.map(part => 
      part.id === id ? updatePartWithStatus(part, updates) : part
    ));
  }, []);

  const removePart = useCallback((id: string) => {
    setParts(prev => prev.filter(part => part.id !== id));
  }, []);

  const clearAllParts = useCallback(() => {
    setParts([]);
  }, []);

  // Create a memoized version that only changes when cutting-relevant properties change
  const cuttingRelevantPartsKey = useMemo(() => {
    // Create a stable key based only on properties that affect cutting
    return parts.map(p => `${p.id}:${p.width}:${p.height}:${p.quantity}:${p.orientation || 'rotatable'}`).join('|');
  }, [parts]);

  // Use the pure optimization function with proper memoization
  const sheetLayout = useMemo((): SheetLayout | null => {
    if (parts.length === 0) return null;
    return optimizeCuttingBLF(parts, cuttingConfig, logger);
    // ESLint disabled: we intentionally use cuttingRelevantPartsKey instead of parts
    // to avoid recalculating when only corner/edge modifications change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cuttingRelevantPartsKey, cuttingConfig, logger]);

  const totalArea = useMemo(() => {
    return parts.reduce((sum, part) => {
      return sum + (Number(part.width) * Number(part.height) * Number(part.quantity));
    }, 0);
  }, [parts]);

  const totalParts = useMemo(() => {
    return parts.reduce((sum, part) => sum + Number(part.quantity), 0);
  }, [parts]);

  return {
    parts,
    sheetLayout,
    totalArea,
    totalParts,
    addPart,
    updatePart,
    removePart,
    clearAllParts,
    // Expose configuration for advanced usage
    config: cuttingConfig
  };
};