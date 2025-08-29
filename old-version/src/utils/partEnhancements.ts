import type {
  Part,
  CornerModification,
  LShapeConfig,
  EdgeTreatment,
  FrameConfig,
} from '../types/simple'
import type { EdgeValue } from './edgeConstants'

/**
 * Utility functions for calculating part enhancement indicators and configuration status
 * Consolidated from partEnhancements.ts and partConfigurationStatus.ts
 */

/**
 * Check if a corner has any modifications (bevel or round)
 */
export const hasCornerModification = (corner: CornerModification): boolean => {
  return corner.type !== 'none' && corner.type !== undefined
}

/**
 * Check if a part has corner modifications
 */
export const hasCornerModifications = (
  corners?: Record<string, CornerModification>,
): boolean => {
  if (!corners) return false
  return Object.values(corners).some((corner) => hasCornerModification(corner))
}

/**
 * Check if any corners in the part have modifications (alias for compatibility)
 */
export const hasAnyCornerModifications = hasCornerModifications

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
 * Check if any edges have treatments applied (alias for compatibility)
 */
export const hasAnyEdgeTreatments = hasEdgeTreatmentsInterface

/**
 * Check if a part is L-shaped
 */
export const isLShape = (lShape?: LShapeConfig): boolean => {
  return lShape?.enabled === true
}

/**
 * Check if L-shape configuration is enabled and has meaningful settings
 */
export const isLShapeConfigured = (lShape?: LShapeConfig): boolean => {
  return isLShape(lShape) && !!(lShape?.leftWidth || lShape?.rightWidth)
}

/**
 * Check if a part is a frame
 */
export const isFrame = (frame?: FrameConfig): boolean => {
  return frame?.enabled === true
}

/**
 * Check if a part has any advanced configuration - Record<string, EdgeValue> version
 */
export const hasAdvancedConfig = (
  corners?: Record<string, CornerModification>,
  edges?: Record<string, EdgeValue>,
  lShape?: LShapeConfig,
  frame?: FrameConfig,
): boolean => {
  return (
    hasCornerModifications(corners) ||
    hasEdgeTreatments(edges) ||
    isLShape(lShape) ||
    isFrame(frame)
  )
}

/**
 * Check if a part has any advanced configuration - EdgeTreatment interface version
 */
export const hasAdvancedConfigInterface = (
  corners?: Record<string, CornerModification>,
  edges?: EdgeTreatment,
  lShape?: LShapeConfig,
  frame?: FrameConfig,
): boolean => {
  return (
    hasCornerModifications(corners) ||
    hasEdgeTreatmentsInterface(edges) ||
    isLShape(lShape) ||
    isFrame(frame)
  )
}

/**
 * Check if a part has advanced configuration (alias for compatibility)
 */
export const hasAdvancedConfiguration = hasAdvancedConfigInterface

/**
 * Compute comprehensive part configuration status
 */
export const computePartConfigurationStatus = (part: Part) => {
  return {
    hasCornerModifications: hasCornerModifications(part.corners),
    hasEdgeTreatments: hasEdgeTreatmentsInterface(part.edges),
    isLShape: isLShape(part.lShape),
    isFrame: isFrame(part.frame),
    hasAdvancedConfig: hasAdvancedConfigInterface(
      part.corners,
      part.edges,
      part.lShape,
      part.frame,
    ),
  }
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
 * Default L-shape configuration
 */
export const getDefaultLShape = (): LShapeConfig => ({
  enabled: false,
})

/**
 * Default frame configuration
 */
export const getDefaultFrame = (): FrameConfig => ({
  enabled: false,
  type: 'type1',
  width: 70,
  grainDirection: 'horizontal',
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
