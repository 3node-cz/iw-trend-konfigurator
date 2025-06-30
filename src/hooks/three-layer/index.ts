/**
 * Three-Layer Architecture Hooks
 *
 * Export all hooks related to the three-layer cutting state architecture
 */

export { useLayeredCuttingState } from './useLayeredCuttingState'
export { useDebounceValue } from './useDebounceValue'

// Re-export types for convenience
export type {
  BasicDimensionalPart,
  OptimizedLayout,
  VisualEnhancements,
  EnhancedCuttingPart,
  LayeredCuttingStateAPI,
} from './useLayeredCuttingState'
