/**
 * CompactPartPreview Component
 * 
 * A compact preview component that shows the shape of a part based on its configuration.
 * Used in the parts list to give users a quick visual of what each part looks like.
 */

import React from 'react'
import type { EnhancedCuttingPart } from '../../../hooks/three-layer/useLayeredCuttingState'
import type { CornerModification } from '../../../types/simple'
import { createRectangleWithCorners } from '../../../utils/svgRendering'
import { 
  CompactPreviewContainer,
  CompactSvg
} from './CompactPartPreview.styles.ts'

interface CompactPartPreviewProps {
  part: EnhancedCuttingPart
  size?: number // Size in pixels, default 60
}

export const CompactPartPreview: React.FC<CompactPartPreviewProps> = ({ 
  part, 
  size = 60 
}) => {
  // Calculate aspect ratio for proper scaling, but make it more square-like
  const aspectRatio = part.width / part.height
  
  // Make the preview more square by limiting extreme aspect ratios (closer to 1:1)
  const maxAspectRatio = 1.2
  const minAspectRatio = 0.8
  
  const constrainedAspectRatio = Math.max(
    minAspectRatio, 
    Math.min(maxAspectRatio, aspectRatio)
  )
  
  const svgWidth = constrainedAspectRatio >= 1 ? size : size * constrainedAspectRatio
  const svgHeight = constrainedAspectRatio >= 1 ? size / constrainedAspectRatio : size

  // Handle Frame configuration
  if (part.frame?.enabled) {
    return (
      <CompactPreviewContainer $width={svgWidth} $height={svgHeight}>
        <CompactSvg viewBox={`0 0 ${part.width} ${part.height}`}>
          {renderFramePreview(part)}
        </CompactSvg>
      </CompactPreviewContainer>
    )
  }

  // Handle L-Shape configuration
  if (part.lShape?.enabled) {
    return (
      <CompactPreviewContainer $width={svgWidth} $height={svgHeight}>
        <CompactSvg viewBox={`0 0 ${part.width} ${part.height}`}>
          {renderLShapeCompactPreview(part)}
        </CompactSvg>
      </CompactPreviewContainer>
    )
  }

  // Handle standard part with corners/edges
  return (
    <CompactPreviewContainer $width={svgWidth} $height={svgHeight}>
      <CompactSvg viewBox={`0 0 ${part.width} ${part.height}`}>
        {renderStandardPartPreview(part)}
      </CompactSvg>
    </CompactPreviewContainer>
  )
}

/**
 * Renders a standard rectangular part with corner and edge modifications
 */
const renderStandardPartPreview = (part: EnhancedCuttingPart) => {
  // Use the SVG rendering utility to create a path with corners
  const corners = (part.corners as Record<string, CornerModification>) || {}
  const scale = 1 // No scaling needed for compact preview
  
  const shapeData = createRectangleWithCorners(
    0, // x
    0, // y
    part.width,
    part.height,
    corners,
    scale,
    "#3498db", // stroke color
    "#E8F4FD"  // fill color
  )
  
  return (
    <path
      d={shapeData.d}
      fill={shapeData.fill}
      stroke={shapeData.stroke}
      strokeWidth="2"
      opacity="0.9"
    />
  )
}

/**
 * Renders an L-shape part preview
 */
const renderLShapeCompactPreview = (part: EnhancedCuttingPart) => {
  if (!part.lShape?.enabled) return null

  // For compact preview, create a simpler L-shape path that fits the basic viewBox
  const leftWidth = part.lShape.leftWidth || 0
  const rightHeight = part.lShape.rightWidth || 0
  
  // Get corner radii if available
  const bottomLeftRadius = Math.min(part.lShape.bottomLeftRadius || 0, leftWidth, rightHeight)
  const topLeftCutoutRadius = Math.min(part.lShape.topLeftCutoutRadius || 0, leftWidth, part.height - rightHeight)
  const innerCutoutRadius = Math.min(part.lShape.innerCutoutRadius || 0, (part.width - leftWidth), (part.height - rightHeight))
  const rightBottomCutoutRadius = Math.min(part.lShape.rightBottomCutoutRadius || 0, (part.width - leftWidth), rightHeight)
  
  // Create L-shape path with corner radii
  let path = 'M 0,0'
  
  // Top edge to cutout
  if (topLeftCutoutRadius > 0) {
    path += ` L ${leftWidth - topLeftCutoutRadius},0`
    path += ` A ${topLeftCutoutRadius},${topLeftCutoutRadius} 0 0,1 ${leftWidth},${topLeftCutoutRadius}`
  } else {
    path += ` L ${leftWidth},0`
  }
  
  // Down to inner corner
  const cutoutStartY = part.height - rightHeight
  if (innerCutoutRadius > 0) {
    path += ` L ${leftWidth},${cutoutStartY - innerCutoutRadius}`
    path += ` A ${innerCutoutRadius},${innerCutoutRadius} 0 0,0 ${leftWidth + innerCutoutRadius},${cutoutStartY}`
  } else {
    path += ` L ${leftWidth},${cutoutStartY}`
  }
  
  // Right to outer edge
  if (rightBottomCutoutRadius > 0) {
    path += ` L ${part.width - rightBottomCutoutRadius},${cutoutStartY}`
    path += ` A ${rightBottomCutoutRadius},${rightBottomCutoutRadius} 0 0,1 ${part.width},${cutoutStartY + rightBottomCutoutRadius}`
  } else {
    path += ` L ${part.width},${cutoutStartY}`
  }
  
  // Down to bottom
  path += ` L ${part.width},${part.height}`
  
  // Bottom edge with corner
  if (bottomLeftRadius > 0) {
    path += ` L ${bottomLeftRadius},${part.height}`
    path += ` A ${bottomLeftRadius},${bottomLeftRadius} 0 0,1 0,${part.height - bottomLeftRadius}`
  } else {
    path += ` L 0,${part.height}`
  }
  
  // Back to start
  path += ' L 0,0 Z'
  
  return (
    <path
      d={path}
      fill="#E8F4FD"
      stroke="#3498db"
      strokeWidth="2"
      opacity="0.9"
    />
  )
}

/**
 * Renders a frame configuration preview showing the divided pieces
 */
const renderFramePreview = (part: EnhancedCuttingPart) => {
  if (!part.frame?.enabled) return null

  // Make frame pieces more visible by using a larger frame width for preview
  const actualFrameWidth = part.frame.width || 70
  const previewFrameWidth = Math.max(actualFrameWidth, part.width * 0.25) // At least 25% of part width for better visibility
  const frameType = part.frame.type
  
  // Use blue color scheme similar to frame configuration
  const frameColor = '#E8F4FD' // Light blue like in frame icons
  const strokeColor = '#3498db' // Blue border
  
  // Calculate piece positions based on frame type
  const pieces = [
    // Top piece
    {
      x: frameType === 'type3' || frameType === 'type4' ? previewFrameWidth : 0,
      y: 0,
      width: frameType === 'type3' || frameType === 'type4' ? part.width - 2 * previewFrameWidth : part.width,
      height: previewFrameWidth,
      label: 'top'
    },
    // Bottom piece  
    {
      x: frameType === 'type3' || frameType === 'type4' ? previewFrameWidth : 0,
      y: part.height - previewFrameWidth,
      width: frameType === 'type3' || frameType === 'type4' ? part.width - 2 * previewFrameWidth : part.width,
      height: previewFrameWidth,
      label: 'bottom'
    },
    // Left piece
    {
      x: 0,
      y: frameType === 'type1' || frameType === 'type2' ? previewFrameWidth : 0,
      width: previewFrameWidth,
      height: frameType === 'type1' || frameType === 'type2' ? part.height - 2 * previewFrameWidth : part.height,
      label: 'left'
    },
    // Right piece
    {
      x: part.width - previewFrameWidth,
      y: frameType === 'type1' || frameType === 'type2' ? previewFrameWidth : 0,
      width: previewFrameWidth,
      height: frameType === 'type1' || frameType === 'type2' ? part.height - 2 * previewFrameWidth : part.height,
      label: 'right'
    },
  ]

  return (
    <>
      {pieces.map((piece, index) => (
        <rect
          key={index}
          x={piece.x}
          y={piece.y}
          width={piece.width}
          height={piece.height}
          fill={frameColor}
          stroke={strokeColor}
          strokeWidth="2"
          opacity="0.9"
        />
      ))}
      
      {/* Add inner cutout area */}
      <rect
        x={previewFrameWidth}
        y={previewFrameWidth}
        width={part.width - 2 * previewFrameWidth}
        height={part.height - 2 * previewFrameWidth}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1"
        strokeDasharray="4,2"
        opacity="0.6"
      />
    </>
  )
}
