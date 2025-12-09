import React from 'react'
import { Box } from '@mui/material'
import type { CuttingPiece } from '../../types/shopify'
import type { PieceGeometry } from '../../types/geometry'
import {
  SVGPathGenerator,
  createGeometryFromPiece,
} from '../../utils/svgPathGenerator'
import { getEdgeColor, getEdgeStrokeWidth } from '../../utils/edgeColors'

interface PieceShapePreviewProps {
  piece: CuttingPiece
  geometry?: PieceGeometry
  containerSize?: number
  containerWidth?: number
  containerHeight?: number
  backgroundImage?: string
  backgroundOpacity?: number
  showBackground?: boolean
  showEdges?: boolean
  showRotationIndicator?: boolean
}

const PieceShapePreview: React.FC<PieceShapePreviewProps> = ({
  piece,
  geometry: customGeometry,
  containerSize = 500,
  containerWidth,
  containerHeight,
  backgroundImage,
  backgroundOpacity = 1,
  showBackground = true,
  showEdges = true,
  showRotationIndicator = true,
}) => {
  // Use custom geometry or create default from piece
  const geometry = customGeometry || createGeometryFromPiece(piece)

  // Fixed container size for large previews (dialogs), or use provided size for thumbnails
  const CONTAINER_SIZE = 500
  const actualWidth = containerWidth || containerSize
  const actualHeight = containerHeight || containerSize
  const isLargePreview = actualWidth >= CONTAINER_SIZE || actualHeight >= CONTAINER_SIZE

  // For large previews, always use fixed 500x500
  const finalWidth = isLargePreview ? CONTAINER_SIZE : actualWidth
  const finalHeight = isLargePreview ? CONTAINER_SIZE : actualHeight

  // Calculate scale to fit the longer dimension to container
  const aspectRatio = geometry.width / geometry.height
  let svgWidth, svgHeight

  if (aspectRatio > 1) {
    // Wider than tall - width fills the container
    svgWidth = finalWidth
    svgHeight = finalWidth / aspectRatio
  } else {
    // Taller than wide - height fills the container
    svgHeight = finalHeight
    svgWidth = finalHeight * aspectRatio
  }

  // Center the SVG in the container
  const offsetX = (finalWidth - svgWidth) / 2
  const offsetY = (finalHeight - svgHeight) / 2

  // Scale to map piece dimensions to SVG dimensions
  const scale = svgWidth / geometry.width

  // Generate SVG path for the shape
  const pathGenerator = new SVGPathGenerator(geometry, scale)
  const piecePath = pathGenerator.generatePath()

  // Extract individual edge thicknesses
  const edgeThicknesses = {
    top: piece.edgeTop !== null ? piece.edgeTop : piece.edgeAllAround || null,
    right: piece.edgeRight !== null ? piece.edgeRight : piece.edgeAllAround || null,
    bottom: piece.edgeBottom !== null ? piece.edgeBottom : piece.edgeAllAround || null,
    left: piece.edgeLeft !== null ? piece.edgeLeft : piece.edgeAllAround || null,
  }

  // Unique ID for mask
  const maskId = `piece-mask-${React.useId()}`

  // Adjust edge indicator positioning and size for small vs large previews
  const edgeOffset = isLargePreview ? 6 : 4 // Smaller offset for thumbnails
  const edgeStrokeWidth = isLargePreview ? 3 : 4 // Thicker stroke for thumbnails

  // Add padding to viewBox for small previews to show edge indicators
  const viewBoxPadding = isLargePreview ? 0 : edgeOffset + edgeStrokeWidth
  const viewBoxWidth = finalWidth + (viewBoxPadding * 2)
  const viewBoxHeight = finalHeight + (viewBoxPadding * 2)
  const viewBoxOffsetX = -viewBoxPadding
  const viewBoxOffsetY = -viewBoxPadding

  return (
    <Box
      sx={{
        width: finalWidth,
        height: finalHeight,
        position: 'relative',
        mx: 'auto',
        // Allow overflow for small thumbnails so edge indicators are visible
        // For large previews, keep hidden to clip the background image
        overflow: isLargePreview ? 'hidden' : 'visible',
      }}
    >
      {/* Material background image - rotated 90deg, masked by SVG shape */}
      {showBackground && backgroundImage && isLargePreview && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: finalWidth,
            height: finalHeight,
            opacity: backgroundOpacity,
            overflow: 'hidden',
            // Apply mask to outer container
            maskImage: `url("data:image/svg+xml,${encodeURIComponent(`
              <svg width="${finalWidth}" height="${finalHeight}" viewBox="0 0 ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(${offsetX}, ${offsetY})">
                  <path d="${piecePath}" fill="white"/>
                </g>
              </svg>
            `)}")`,
            maskSize: `${finalWidth}px ${finalHeight}px`,
            maskPosition: 'center',
            maskRepeat: 'no-repeat',
            WebkitMaskImage: `url("data:image/svg+xml,${encodeURIComponent(`
              <svg width="${finalWidth}" height="${finalHeight}" viewBox="0 0 ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(${offsetX}, ${offsetY})">
                  <path d="${piecePath}" fill="white"/>
                </g>
              </svg>
            `)}")`,
            WebkitMaskSize: `${finalWidth}px ${finalHeight}px`,
            WebkitMaskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
          }}
        >
          {/* Rotated img element */}
          <Box
            component="img"
            src={backgroundImage}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'translate(-50%, -50%) rotate(90deg)',
              transformOrigin: 'center center',
            }}
          />
        </Box>
      )}

      {/* SVG shape overlay */}
      <svg
        width={finalWidth}
        height={finalHeight}
        viewBox={`${viewBoxOffsetX} ${viewBoxOffsetY} ${viewBoxWidth} ${viewBoxHeight}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <g transform={`translate(${offsetX + viewBoxPadding}, ${offsetY + viewBoxPadding})`}>
          {/* Main piece shape outline */}
          <path
            d={piecePath}
            fill="none"
            stroke="#1976d2"
            strokeWidth="2"
            style={{
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
            }}
          />

          {/* Edge indicators */}
          {showEdges && (
            <>
              {/* Top edge */}
              {edgeThicknesses.top && (
                <line
                  x1={0}
                  y1={-edgeOffset}
                  x2={svgWidth}
                  y2={-edgeOffset}
                  stroke={getEdgeColor(edgeThicknesses.top)}
                  strokeWidth={edgeStrokeWidth}
                  strokeLinecap="round"
                />
              )}

              {/* Right edge */}
              {edgeThicknesses.right && (
                <line
                  x1={svgWidth + edgeOffset}
                  y1={0}
                  x2={svgWidth + edgeOffset}
                  y2={svgHeight}
                  stroke={getEdgeColor(edgeThicknesses.right)}
                  strokeWidth={edgeStrokeWidth}
                  strokeLinecap="round"
                />
              )}

              {/* Bottom edge */}
              {edgeThicknesses.bottom && (
                <line
                  x1={0}
                  y1={svgHeight + edgeOffset}
                  x2={svgWidth}
                  y2={svgHeight + edgeOffset}
                  stroke={getEdgeColor(edgeThicknesses.bottom)}
                  strokeWidth={edgeStrokeWidth}
                  strokeLinecap="round"
                />
              )}

              {/* Left edge */}
              {edgeThicknesses.left && (
                <line
                  x1={-edgeOffset}
                  y1={0}
                  x2={-edgeOffset}
                  y2={svgHeight}
                  stroke={getEdgeColor(edgeThicknesses.left)}
                  strokeWidth={edgeStrokeWidth}
                  strokeLinecap="round"
                />
              )}
            </>
          )}
        </g>
      </svg>

      {/* Rotation indicator */}
      {showRotationIndicator && piece.allowRotation && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: '#4caf50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: 'white',
            fontWeight: 'bold',
          }}
          title="Rotácia povolená"
        >
          ↻
        </Box>
      )}
    </Box>
  )
}

export default PieceShapePreview
