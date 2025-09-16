import React from 'react'
import { Box } from '@mui/material'
import type { CuttingPiece } from '../../types/shopify'
import type { PieceGeometry, EdgeConfig } from '../../types/geometry'
import { SVGPathGenerator, createGeometryFromPiece } from '../../utils/svgPathGenerator'

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
  containerSize = 400,
  containerWidth,
  containerHeight,
  backgroundImage,
  backgroundOpacity = 0.8,
  showBackground = true,
  showEdges = true,
  showRotationIndicator = true
}) => {
  // Use custom geometry or create default from piece
  const geometry = customGeometry || createGeometryFromPiece(piece)
  
  // Determine actual container dimensions
  const actualWidth = containerWidth || containerSize
  const actualHeight = containerHeight || containerSize
  
  // Calculate scale to fit container with padding
  const padding = 10
  const maxDimension = Math.max(geometry.width, geometry.height)
  const availableWidth = actualWidth - (padding * 2)
  const availableHeight = actualHeight - (padding * 2)
  const scaleX = availableWidth / geometry.width
  const scaleY = availableHeight / geometry.height
  const scale = Math.min(scaleX, scaleY, availableWidth / maxDimension, availableHeight / maxDimension)
  
  // Calculate actual display dimensions
  const displayWidth = geometry.width * scale
  const displayHeight = geometry.height * scale
  
  // Center the piece in the container
  const offsetX = (actualWidth - displayWidth) / 2
  const offsetY = (actualHeight - displayHeight) / 2
  
  // Generate SVG path
  const pathGenerator = new SVGPathGenerator(geometry, scale)
  const piecePath = pathGenerator.generatePath()
  
  // Generate unique IDs for SVG definitions
  const patternId = `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const clipId = `clip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  // Extract edge configuration from piece
  const edgeConfig: EdgeConfig = {
    top: piece.edgeAllAround || piece.edgeTop || undefined,
    right: piece.edgeAllAround || piece.edgeRight || undefined,
    bottom: piece.edgeAllAround || piece.edgeBottom || undefined,
    left: piece.edgeAllAround || piece.edgeLeft || undefined,
    allAround: piece.edgeAllAround || undefined
  }

  return (
    <Box
      sx={{
        width: actualWidth,
        height: actualHeight,
        position: 'relative',
        mx: 'auto'
      }}
    >
      <svg
        width={actualWidth}
        height={actualHeight}
        viewBox={`0 0 ${actualWidth} ${actualHeight}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        {/* SVG Definitions for patterns and clipping */}
        <defs>
          {showBackground && backgroundImage && (
            <>
              {/* Pattern definition for background image */}
              <pattern
                id={patternId}
                patternUnits="objectBoundingBox"
                width="1"
                height="1"
                preserveAspectRatio="xMidYMid slice"
              >
                <image
                  href={backgroundImage}
                  width={displayHeight}
                  height={displayWidth}
                  x={(displayWidth - displayHeight) / 2}
                  y={(displayHeight - displayWidth) / 2}
                  opacity={backgroundOpacity}
                  preserveAspectRatio="xMidYMid slice"
                  transform={`rotate(90 ${displayWidth/2} ${displayHeight/2})`}
                />
              </pattern>
              
              {/* Clipping path to match the piece shape */}
              <clipPath id={clipId}>
                <path d={piecePath} />
              </clipPath>
            </>
          )}
        </defs>

        <g transform={`translate(${offsetX}, ${offsetY})`}>
          {/* Main piece shape */}
          <path
            d={piecePath}
            fill={showBackground && backgroundImage ? `url(#${patternId})` : "#ffffff"}
            stroke="#1976d2"
            strokeWidth="2"
            clipPath={showBackground && backgroundImage ? `url(#${clipId})` : undefined}
            style={{
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))'
            }}
          />
          
          {/* Edge indicators */}
          {showEdges && (
            <>
              {/* Top edge */}
              {edgeConfig.top && (
                <line
                  x1={0}
                  y1={-6}
                  x2={displayWidth}
                  y2={-6}
                  stroke="#ff9800"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              )}
              
              {/* Right edge */}
              {edgeConfig.right && (
                <line
                  x1={displayWidth + 6}
                  y1={0}
                  x2={displayWidth + 6}
                  y2={displayHeight}
                  stroke="#ff9800"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              )}
              
              {/* Bottom edge */}
              {edgeConfig.bottom && (
                <line
                  x1={0}
                  y1={displayHeight + 6}
                  x2={displayWidth}
                  y2={displayHeight + 6}
                  stroke="#ff9800"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              )}
              
              {/* Left edge */}
              {edgeConfig.left && (
                <line
                  x1={-6}
                  y1={0}
                  x2={-6}
                  y2={displayHeight}
                  stroke="#ff9800"
                  strokeWidth="4"
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
            fontWeight: 'bold'
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