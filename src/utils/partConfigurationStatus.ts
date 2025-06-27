import type {
  Part,
  CornerModification,
  EdgeTreatment,
  LShapeConfig,
} from '../types/simple'

/**
 * Utility functions for computing part configuration metadata
 */

/**
 * Check if a corner has any modifications (bevel or round)
 */
export const hasCornerModification = (corner: CornerModification): boolean => {
  return corner.type !== 'none' && corner.type !== undefined
}

/**
 * Check if any corners in the part have modifications
 */
export const hasAnyCornerModifications = (
  corners?: Part['corners'],
): boolean => {
  if (!corners) return false

  return (
    hasCornerModification(corners.topLeft) ||
    hasCornerModification(corners.topRight) ||
    hasCornerModification(corners.bottomRight) ||
    hasCornerModification(corners.bottomLeft)
  )
}

/**
 * Check if any edges have treatments applied
 */
export const hasAnyEdgeTreatments = (edges?: EdgeTreatment): boolean => {
  if (!edges) return false

  return (
    edges.top !== 'none' ||
    edges.right !== 'none' ||
    edges.bottom !== 'none' ||
    edges.left !== 'none'
  )
}

/**
 * Check if L-shape configuration is enabled and has meaningful settings
 */
export const isLShapeConfigured = (lShape?: LShapeConfig): boolean => {
  if (!lShape || !lShape.enabled) return false

  // Check if any L-shape dimensions or corner radii are set
  return !!(
    lShape.topLeftWidth ||
    lShape.topLeftHeight ||
    lShape.bottomRightWidth ||
    lShape.bottomRightHeight ||
    lShape.innerCornerRadius ||
    lShape.topInnerCornerRadius ||
    lShape.bottomInnerCornerRadius
  )
}

/**
 * Check if part has any advanced configuration (corners, edges, or L-shape)
 */
export const hasAdvancedConfiguration = (part: Part): boolean => {
  return (
    hasAnyCornerModifications(part.corners) ||
    hasAnyEdgeTreatments(part.edges) ||
    isLShapeConfigured(part.lShape)
  )
}

/**
 * Compute all configuration status flags for a part
 */
export const computePartConfigurationStatus = (
  part: Part,
): {
  hasCornerModifications: boolean
  hasEdgeTreatments: boolean
  isLShape: boolean
  hasAdvancedConfig: boolean
} => {
  const hasCornerModifications = hasAnyCornerModifications(part.corners)
  const hasEdgeTreatments = hasAnyEdgeTreatments(part.edges)
  const isLShape = isLShapeConfigured(part.lShape)
  const hasAdvancedConfig =
    hasCornerModifications || hasEdgeTreatments || isLShape

  return {
    hasCornerModifications,
    hasEdgeTreatments,
    isLShape,
    hasAdvancedConfig,
  }
}

/**
 * Create a part with computed configuration status
 */
export const createPartWithStatus = (
  partData: Omit<
    Part,
    | 'id'
    | 'hasCornerModifications'
    | 'hasEdgeTreatments'
    | 'isLShape'
    | 'hasAdvancedConfig'
  >,
): Omit<Part, 'id'> => {
  const status = computePartConfigurationStatus(partData as Part)

  return {
    ...partData,
    ...status,
  }
}

/**
 * Update a part with recomputed configuration status
 */
export const updatePartWithStatus = (
  part: Part,
  updates: Partial<Part>,
): Part => {
  const updatedPart = { ...part, ...updates }
  const status = computePartConfigurationStatus(updatedPart)

  return {
    ...updatedPart,
    ...status,
  }
}
