import type {
  CornerModification,
  LShapeConfig,
  EdgeTreatment,
} from '../types/simple'
import type { EdgeValue } from './edgeConstants'

/**
 * Utility functions for calculating part enhancement indicators
 */

/**
 * Check if a part has corner modifications
 */
export const hasCornerModifications = (
  corners?: Record<string, CornerModification>,
): boolean => {
  return !!(corners && Object.values(corners).some((corner) => corner !== null))
}

/**
 * Check if a part has edge treatments - Record<string, EdgeValue> version
 */
export const hasEdgeTreatments = (
  edges?: Record<string, EdgeValue>,
): boolean => {
  return !!(edges && Object.values(edges).some((edge) => edge !== 'none'))
}

/**
 * Check if a part has edge treatments - EdgeTreatment interface version
 */
export const hasEdgeTreatmentsInterface = (edges?: EdgeTreatment): boolean => {
  return !!(edges && Object.values(edges).some((edge) => edge !== 'none'))
}

/**
 * Check if a part is L-shaped
 */
export const isLShape = (lShape?: LShapeConfig): boolean => {
  return lShape?.enabled === true
}

/**
 * Check if a part has any advanced configuration - Record<string, EdgeValue> version
 */
export const hasAdvancedConfig = (
  corners?: Record<string, CornerModification>,
  edges?: Record<string, EdgeValue>,
  lShape?: LShapeConfig,
): boolean => {
  return (
    hasCornerModifications(corners) ||
    hasEdgeTreatments(edges) ||
    isLShape(lShape)
  )
}

/**
 * Check if a part has any advanced configuration - EdgeTreatment interface version
 */
export const hasAdvancedConfigInterface = (
  corners?: Record<string, CornerModification>,
  edges?: EdgeTreatment,
  lShape?: LShapeConfig,
): boolean => {
  return (
    hasCornerModifications(corners) ||
    hasEdgeTreatmentsInterface(edges) ||
    isLShape(lShape)
  )
}

/**
 * Generate unique part ID
 */
export const generatePartId = (): string => {
  return `part-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Default edge configuration
 */
export const getDefaultEdges = () => ({
  top: 'none' as EdgeValue,
  right: 'none' as EdgeValue,
  bottom: 'none' as EdgeValue,
  left: 'none' as EdgeValue,
})

/**
 * Default corner configuration
 */
export const getDefaultCorners = () => ({
  topLeft: { type: 'none' as const },
  topRight: { type: 'none' as const },
  bottomRight: { type: 'none' as const },
  bottomLeft: { type: 'none' as const },
})

/**
 * Edge position mapping
 */
export const EDGE_KEYS = ['top', 'right', 'bottom', 'left'] as const

/**
 * Corner position mapping
 */
export const CORNER_KEYS = [
  'topLeft',
  'topRight',
  'bottomRight',
  'bottomLeft',
] as const
