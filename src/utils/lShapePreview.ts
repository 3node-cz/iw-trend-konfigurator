import type { Part, LShapeConfig } from '../types/simple'

interface LShapePathParams {
  width: number
  height: number
  cutoutStartX: number
  cutoutStartY: number
  bottomLeftRadius: number
  topLeftCutoutRadius: number
  innerCutoutRadius: number
  rightBottomCutoutRadius: number
}

const generateLShapePathWithRadii = (params: LShapePathParams): string => {
  const {
    width,
    height,
    cutoutStartX,
    cutoutStartY,
    bottomLeftRadius,
    topLeftCutoutRadius,
    innerCutoutRadius,
    rightBottomCutoutRadius,
  } = params

  // Clamp radii to prevent overlaps - bottom left can use full dimensions
  const maxBottomLeftRadius = Math.min(bottomLeftRadius, width, height)
  // topLeftCutout can use full cutout height and should not exceed cutout width
  const maxTopLeftCutoutRadius = Math.min(
    topLeftCutoutRadius,
    cutoutStartX,
    cutoutStartY,
  )
  // innerCutout is limited by the cutout dimensions
  const maxInnerCutoutRadius = Math.min(
    innerCutoutRadius,
    (width - cutoutStartX) / 2,
    cutoutStartY / 2,
  )
  // rightBottomCutout can use full available space on both sides
  const maxRightBottomCutoutRadius = Math.min(
    rightBottomCutoutRadius,
    width - cutoutStartX,
    height - cutoutStartY,
  )

  let path = ''

  // Start at top-left corner (this should always be sharp - it's the outer corner)
  path += `M 0,0`

  // Top edge to cutout start
  if (maxTopLeftCutoutRadius > 0) {
    // Go to where the arc should start on the top edge
    path += ` L ${cutoutStartX - maxTopLeftCutoutRadius},0`
    // Create proper circular arc that curves down into the cutout
    path += ` A ${maxTopLeftCutoutRadius},${maxTopLeftCutoutRadius} 0 0,1 ${cutoutStartX},${maxTopLeftCutoutRadius}`
  } else {
    path += ` L ${cutoutStartX},0`
  }

  // Cutout vertical edge down to inner corner
  if (maxInnerCutoutRadius > 0) {
    path += ` L ${cutoutStartX},${cutoutStartY - maxInnerCutoutRadius}`
    // Inner cutout corner - proper circular arc
    path += ` A ${maxInnerCutoutRadius},${maxInnerCutoutRadius} 0 0,1 ${
      cutoutStartX + maxInnerCutoutRadius
    },${cutoutStartY}`
  } else {
    path += ` L ${cutoutStartX},${cutoutStartY}`
  }

  // Cutout horizontal edge
  if (maxRightBottomCutoutRadius > 0) {
    path += ` L ${width - maxRightBottomCutoutRadius},${cutoutStartY}`
    // Right-bottom cutout corner - proper circular arc
    path += ` A ${maxRightBottomCutoutRadius},${maxRightBottomCutoutRadius} 0 0,1 ${width},${
      cutoutStartY + maxRightBottomCutoutRadius
    }`
  } else {
    path += ` L ${width},${cutoutStartY}`
  }

  // Right edge
  path += ` L ${width},${height}`

  // Bottom edge
  if (maxBottomLeftRadius > 0) {
    path += ` L ${maxBottomLeftRadius},${height}`
    // Bottom-left corner - proper circular arc
    path += ` A ${maxBottomLeftRadius},${maxBottomLeftRadius} 0 0,1 0,${
      height - maxBottomLeftRadius
    }`
  } else {
    path += ` L 0,${height}`
  }

  // Left edge back to start (no rounding at outer top-left corner)
  path += ` L 0,0`

  path += ' Z'
  return path
}

export interface LShapePreviewData {
  previewWidth: number
  previewHeight: number
  previewLeftWidth: number
  previewRightHeight: number
  cutoutStartX: number
  cutoutStartY: number
  path: string
  viewBoxWidth: number
  viewBoxHeight: number
  shapeOffsetX: number
  shapeOffsetY: number
}

export const calculateLShapePreview = (
  part: Part,
  lShape: LShapeConfig,
): LShapePreviewData => {
  const leftWidth = lShape.leftWidth || 0
  const rightHeight = lShape.rightWidth || 0 // This is actually height from bottom-right going up

  // Calculate dimensions for preview (make it bigger)
  const maxWidth = 600
  const maxHeight = 450
  const scaleX = maxWidth / part.width
  const scaleY = maxHeight / part.height
  const scale = Math.min(scaleX, scaleY)

  const previewWidth = part.width * scale
  const previewHeight = part.height * scale
  const previewLeftWidth = leftWidth * scale
  const previewRightHeight = rightHeight * scale

  // Generate L-shape path (cutout in top-right corner)
  // leftWidth = distance from left edge to cutout horizontally
  // rightHeight = distance from bottom edge going up vertically (solid part, not cutout)
  const cutoutStartX = previewLeftWidth
  const solidBottomHeight = previewRightHeight
  const cutoutStartY = previewHeight - solidBottomHeight

  // Scale the radii to preview size
  const scaledBottomLeftRadius = (lShape.bottomLeftRadius || 0) * scale
  const scaledTopLeftCutoutRadius = (lShape.topLeftCutoutRadius || 0) * scale
  const scaledInnerCutoutRadius = (lShape.innerCutoutRadius || 0) * scale
  const scaledRightBottomCutoutRadius =
    (lShape.rightBottomCutoutRadius || 0) * scale

  // Generate path with rounded corners
  const path = generateLShapePathWithRadii({
    width: previewWidth,
    height: previewHeight,
    cutoutStartX,
    cutoutStartY,
    bottomLeftRadius: scaledBottomLeftRadius,
    topLeftCutoutRadius: scaledTopLeftCutoutRadius,
    innerCutoutRadius: scaledInnerCutoutRadius,
    rightBottomCutoutRadius: scaledRightBottomCutoutRadius,
  })

  // Expand viewBox to include space for labels
  const viewBoxMargin = 30
  const viewBoxWidth = previewWidth + viewBoxMargin * 2
  const viewBoxHeight = previewHeight + viewBoxMargin * 2
  const shapeOffsetX = viewBoxMargin
  const shapeOffsetY = viewBoxMargin

  return {
    previewWidth,
    previewHeight,
    previewLeftWidth,
    previewRightHeight,
    cutoutStartX,
    cutoutStartY,
    path,
    viewBoxWidth,
    viewBoxHeight,
    shapeOffsetX,
    shapeOffsetY,
  }
}

export const createLShapeDefault = (part: Part): LShapeConfig => ({
  enabled: true,
  leftWidth: Math.floor(part.width * 0.6),
  rightWidth: Math.floor(part.width * 0.4),
  bottomLeftRadius: 0,
  topLeftCutoutRadius: 0,
  innerCutoutRadius: 0,
  rightBottomCutoutRadius: 0,
})
