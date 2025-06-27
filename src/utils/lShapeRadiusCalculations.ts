import type { Part, LShapeConfig } from '../types/simple'

/**
 * Calculate maximum allowed radius for L-shape corners considering adjacent corners and available space
 */
export function calculateLShapeMaxRadius(
  part: Part,
  lShape: LShapeConfig,
  corner: 'bottomLeft' | 'topLeftCutout' | 'innerCutout' | 'rightBottomCutout',
): number {
  const leftWidth = lShape.leftWidth || 0
  const rightHeight = lShape.rightWidth || 0 // This is actually height from bottom going up

  // Get radius values for adjacent corners
  const topLeftCutoutRadius = lShape.topLeftCutoutRadius || 0
  const innerCutoutRadius = lShape.innerCutoutRadius || 0
  const rightBottomCutoutRadius = lShape.rightBottomCutoutRadius || 0

  switch (corner) {
    case 'bottomLeft': {
      // Bottom left corner is limited by full part dimensions (not affected by cutout)
      // - Vertical: full height of the part
      // - Horizontal: full width of the part
      const availableVertical = part.height
      const availableHorizontal = part.width
      return Math.max(0, Math.min(availableVertical, availableHorizontal))
    }

    case 'topLeftCutout': {
      // Top left cutout corner is limited by:
      // - Vertical: cutout height (total height - right height from bottom)
      // - Horizontal: distance to inner cutout corner (leftWidth from left)
      const cutoutHeight = part.height - rightHeight
      const availableVertical = cutoutHeight - innerCutoutRadius
      const availableHorizontal = leftWidth - innerCutoutRadius
      return Math.max(0, Math.min(availableVertical, availableHorizontal))
    }

    case 'innerCutout': {
      // Inner cutout corner is limited by:
      // - Horizontal: cutout width (part.width - leftWidth)
      // - Vertical: cutout height (part.height - rightHeight)
      // - Adjacent corners: topLeftCutout and rightBottomCutout
      const cutoutWidth = part.width - leftWidth
      const cutoutHeight = part.height - rightHeight
      const availableHorizontal = cutoutWidth - topLeftCutoutRadius
      const availableVertical = cutoutHeight - rightBottomCutoutRadius

      // Debug logging
      console.log('Inner cutout calculation:', {
        cutoutWidth,
        cutoutHeight,
        topLeftCutoutRadius,
        rightBottomCutoutRadius,
        availableHorizontal,
        availableVertical,
      })

      return Math.max(0, Math.min(availableHorizontal, availableVertical))
    }

    case 'rightBottomCutout': {
      // Right bottom cutout corner is limited by:
      // - Horizontal: cutout width (part.width - leftWidth)
      // - Vertical: solid right side height (rightHeight, not cutout height)
      // - Adjacent corners: innerCutout
      const cutoutWidth = part.width - leftWidth
      const solidRightHeight = rightHeight // This is the height of the solid part from bottom
      const availableHorizontal = cutoutWidth - innerCutoutRadius
      const availableVertical = solidRightHeight - innerCutoutRadius
      return Math.max(0, Math.min(availableHorizontal, availableVertical))
    }

    default:
      return 0
  }
}

/**
 * Validate and constrain L-shape radius value
 */
export function validateLShapeRadius(
  part: Part,
  lShape: LShapeConfig,
  corner: 'bottomLeft' | 'topLeftCutout' | 'innerCutout' | 'rightBottomCutout',
  value: number,
): number {
  const maxRadius = calculateLShapeMaxRadius(part, lShape, corner)
  return Math.min(Math.max(0, value || 0), maxRadius)
}

/**
 * Get all L-shape radius constraints
 */
export function getLShapeRadiusConstraints(part: Part, lShape: LShapeConfig) {
  return {
    bottomLeft: calculateLShapeMaxRadius(part, lShape, 'bottomLeft'),
    topLeftCutout: calculateLShapeMaxRadius(part, lShape, 'topLeftCutout'),
    innerCutout: calculateLShapeMaxRadius(part, lShape, 'innerCutout'),
    rightBottomCutout: calculateLShapeMaxRadius(
      part,
      lShape,
      'rightBottomCutout',
    ),
  }
}
