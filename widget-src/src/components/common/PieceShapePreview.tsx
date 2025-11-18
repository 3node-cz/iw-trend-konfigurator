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

  return (
    <Box
      sx={{
        width: finalWidth,
        height: finalHeight,
        position: 'relative',
        mx: 'auto',
        overflow: 'hidden',
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
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: 'rotate(90deg)',
            transformOrigin: 'center center',
            opacity: backgroundOpacity,
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
        />
      )}

      {/* SVG shape overlay */}
      <svg
        width={finalWidth}
        height={finalHeight}
        viewBox={`0 0 ${finalWidth} ${finalHeight}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <g transform={`translate(${offsetX}, ${offsetY})`}>
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
                  y1={-6}
                  x2={svgWidth}
                  y2={-6}
                  stroke={getEdgeColor(edgeThicknesses.top)}
                  strokeWidth={getEdgeStrokeWidth(edgeThicknesses.top)}
                  strokeLinecap="round"
                />
              )}

              {/* Right edge */}
              {edgeThicknesses.right && (
                <line
                  x1={svgWidth + 6}
                  y1={0}
                  x2={svgWidth + 6}
                  y2={svgHeight}
                  stroke={getEdgeColor(edgeThicknesses.right)}
                  strokeWidth={getEdgeStrokeWidth(edgeThicknesses.right)}
                  strokeLinecap="round"
                />
              )}

              {/* Bottom edge */}
              {edgeThicknesses.bottom && (
                <line
                  x1={0}
                  y1={svgHeight + 6}
                  x2={svgWidth}
                  y2={svgHeight + 6}
                  stroke={getEdgeColor(edgeThicknesses.bottom)}
                  strokeWidth={getEdgeStrokeWidth(edgeThicknesses.bottom)}
                  strokeLinecap="round"
                />
              )}

              {/* Left edge */}
              {edgeThicknesses.left && (
                <line
                  x1={-6}
                  y1={0}
                  x2={-6}
                  y2={svgHeight}
                  stroke={getEdgeColor(edgeThicknesses.left)}
                  strokeWidth={getEdgeStrokeWidth(edgeThicknesses.left)}
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
