import type { Part, LShapeConfig } from '../types/simple'

/**
 * Utility functions for L-shape configuration and management
 */

/**
 * Create default L-shape configuration
 */
export function createDefaultLShapeConfig(
  width: number,
  height: number,
): LShapeConfig {
  return {
    enabled: true,
    leftWidth: Math.round(width * 0.6),
    rightWidth: Math.round(width * 0.4),
    bottomLeftRadius: 0,
    topLeftCutoutRadius: 0,
    innerCutoutRadius: 0,
    rightBottomCutoutRadius: 0,
    // Legacy support
    topLeftWidth: Math.round(width * 0.6),
    topLeftHeight: Math.round(height * 0.6),
    innerCornerRadius: 0,
  }
}

/**
 * Update L-shape configuration for a part
 */
export function updateLShapeConfig(
  part: Part,
  updates: Partial<LShapeConfig>,
): Partial<Part> {
  const currentLShape = part.lShape || { enabled: false }
  const updatedLShape = { ...currentLShape, ...updates }

  return { lShape: updatedLShape }
}

/**
 * Calculate L-shape preview dimensions for rendering
 */
export function calculateLShapePreviewDimensions(
  part: Part,
  maxDimension: number = 300,
  padding: number = 40,
) {
  const scale = Math.min(maxDimension / part.width, maxDimension / part.height)
  const width = part.width * scale
  const height = part.height * scale

  const lShape = part.lShape
  if (!lShape || !lShape.enabled) {
    return { scale, width, height, padding }
  }

  const topLeftW = (lShape.topLeftWidth || 0) * scale
  const topLeftH = (lShape.topLeftHeight || 0) * scale
  const bottomRightW = width - topLeftW
  const bottomRightH = height - topLeftH

  return {
    scale,
    width,
    height,
    padding,
    topLeftW,
    topLeftH,
    bottomRightW,
    bottomRightH,
    viewBoxWidth: width + padding * 2,
    viewBoxHeight: height + padding * 2,
  }
}

/**
 * Generate SVG path for L-shape
 */
export function generateLShapePath(
  dimensions: ReturnType<typeof calculateLShapePreviewDimensions>,
) {
  const {
    width,
    height,
    topLeftW,
    topLeftH,
    bottomRightW,
    bottomRightH,
    padding,
  } = dimensions

  if (!topLeftW || !topLeftH || !bottomRightW || !bottomRightH) {
    // Fallback to rectangle if dimensions are invalid
    return `M ${padding} ${padding} L ${padding + width} ${padding} L ${
      padding + width
    } ${padding + height} L ${padding} ${padding + height} Z`
  }

  // L-shape path: start from top-left, go clockwise
  return [
    `M ${padding} ${padding}`, // Start at top-left
    `L ${padding + topLeftW} ${padding}`, // Top edge of left rectangle
    `L ${padding + topLeftW} ${padding + topLeftH}`, // Down to inner corner
    `L ${padding + width} ${padding + topLeftH}`, // Right to edge
    `L ${padding + width} ${padding + height}`, // Down to bottom-right
    `L ${padding} ${padding + height}`, // Left to bottom-left
    `Z`, // Close path
  ].join(' ')
}

/**
 * Create L-shape update handlers for components
 */
export function createLShapeHandlers(
  part: Part,
  onPartUpdate: (id: string, updates: Partial<Part>) => void,
) {
  const handleLShapeToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultLShape = createDefaultLShapeConfig(part.width, part.height)
      const updates = updateLShapeConfig(part, defaultLShape)
      onPartUpdate(part.id, updates)
    } else {
      onPartUpdate(part.id, { lShape: { enabled: false } })
    }
  }

  const handleLShapeUpdate = (updates: Partial<LShapeConfig>) => {
    const partUpdates = updateLShapeConfig(part, updates)
    onPartUpdate(part.id, partUpdates)
  }

  return {
    handleLShapeToggle,
    handleLShapeUpdate,
  }
}
