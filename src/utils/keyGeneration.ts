import type { CornerModification } from '../types/simple'

/**
 * Utility functions for generating unique keys for React components
 */

/**
 * Generate a basic part key for memoization
 */
export const generateBasicPartKey = (part: {
  id: string
  width: number
  height: number
  quantity: number
}): string => {
  return `${part.id}-${part.width}-${part.height}-${part.quantity}`
}

/**
 * Generate a parts array key for memoization
 */
export const generateBasicPartsKey = (
  parts: Array<{
    id: string
    width: number
    height: number
    quantity: number
  }>,
): string => {
  return parts.map(generateBasicPartKey).join('|')
}

/**
 * Generate a corner key for memoization
 */
export const generateCornerKey = (
  corners?: Record<string, CornerModification>,
): string => {
  if (!corners) return 'no-corners'

  return Object.values(corners)
    .map((c: CornerModification) => `${c.type}-${c.x || 0}-${c.y || 0}`)
    .join(',')
}

/**
 * Generate an edge key for memoization
 */
export const generateEdgeKey = (edges?: Record<string, string>): string => {
  if (!edges) return 'no-edges'

  return Object.values(edges).join(',')
}

/**
 * Generate an L-shape key for memoization
 */
export const generateLShapeKey = (lShape?: {
  enabled: boolean
  leftWidth?: number
  topHeight?: number
}): string => {
  if (!lShape?.enabled) return 'no-lshape'

  return `lshape-${lShape.leftWidth || 0}-${lShape.topHeight || 0}`
}

/**
 * Generate a visual enhancements key for memoization
 */
export const generateVisualKey = (
  selectedPartId: string | undefined,
  visualEnhancements: Record<
    string,
    {
      corners?: Record<string, CornerModification>
      edges?: Record<string, string>
      lShape?: { enabled: boolean; leftWidth?: number; topHeight?: number }
    }
  >,
): string => {
  if (!selectedPartId) return 'no-selection'

  const enhancements = visualEnhancements[selectedPartId]
  if (!enhancements) return `${selectedPartId}-no-enhancements`

  const cornerKey = generateCornerKey(enhancements.corners)
  const edgeKey = generateEdgeKey(enhancements.edges)
  const lShapeKey = generateLShapeKey(enhancements.lShape)

  return `${selectedPartId}-${cornerKey}-${edgeKey}-${lShapeKey}`
}

/**
 * Generate enhanced parts key for memoization
 */
export const generateEnhancedPartsKey = (
  enhancedParts: Array<{
    id: string
    width: number
    height: number
    quantity: number
    corners?: Record<string, CornerModification>
    edges?: Record<string, string>
    lShape?: { enabled: boolean }
  }>,
): string => {
  return enhancedParts
    .map((part) => {
      const basicKey = generateBasicPartKey(part)
      const hasVisuals = part.corners || part.edges || part.lShape?.enabled
      return `${basicKey}-${hasVisuals ? 'visual' : 'basic'}`
    })
    .join('|')
}
