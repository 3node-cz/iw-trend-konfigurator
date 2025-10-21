import React from 'react'
import { Box, Typography } from '@mui/material'
import type { CuttingPiece } from '../types/shopify'
import type { PieceGeometry, EdgeConfig } from '../types/geometry'
import { SVGPathGenerator, createGeometryFromPiece } from '../utils/svgPathGenerator'

interface AdvancedPiecePreviewProps {
  piece: CuttingPiece
  geometry?: PieceGeometry
  containerSize?: number
  showDimensions?: boolean
  showEdges?: boolean
  interactive?: boolean
  backgroundImage?: string
  backgroundOpacity?: number
}

const AdvancedPiecePreview: React.FC<AdvancedPiecePreviewProps> = ({
  piece,
  geometry: customGeometry,
  containerSize = 400,
  showDimensions = false,
  showEdges = true,
  interactive = false,
  backgroundImage,
  backgroundOpacity = 0.8
}) => {
  // Use custom geometry or create default from piece
  const geometry = customGeometry || createGeometryFromPiece(piece)
  
  // Calculate scale to fit container with padding for labels
  const labelSpace = showDimensions ? 40 : 10
  const maxDimension = Math.max(geometry.width, geometry.height)
  const availableSpace = containerSize - (labelSpace * 2)
  const scale = availableSpace / maxDimension
  
  // Calculate actual display dimensions
  const displayWidth = geometry.width * scale
  const displayHeight = geometry.height * scale
  
  // Center the piece in the container
  const offsetX = (containerSize - displayWidth) / 2
  const offsetY = (containerSize - displayHeight) / 2
  
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
        width: containerSize,
        height: containerSize,
        position: 'relative',
        mx: 'auto'
      }}
    >
      <svg
        width={containerSize}
        height={containerSize}
        viewBox={`0 0 ${containerSize} ${containerSize}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        {/* SVG Definitions for patterns and clipping */}
        <defs>
          {backgroundImage && (
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
                  width={displayWidth}
                  height={displayHeight}
                  x="0"
                  y="0"
                  opacity={backgroundOpacity}
                  preserveAspectRatio="xMidYMid slice"
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
            fill={backgroundImage ? `url(#${patternId})` : "#ffffff"}
            stroke="#1976d2"
            strokeWidth="2"
            clipPath={backgroundImage ? `url(#${clipId})` : undefined}
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
        
        {/* Dimension labels */}
        {showDimensions && (
          <>
            {/* Width label (top) */}
            <text
              x={offsetX + displayWidth / 2}
              y={offsetY - 10}
              textAnchor="middle"
              fontSize="12"
              fill="#666"
              fontWeight="500"
            >
              {geometry.width} mm
            </text>
            
            {/* Height label (left, rotated) */}
            <text
              x={offsetX - 20}
              y={offsetY + displayHeight / 2}
              textAnchor="middle"
              fontSize="12"
              fill="#666"
              fontWeight="500"
              transform={`rotate(-90, ${offsetX - 20}, ${offsetY + displayHeight / 2})`}
            >
              {geometry.height} mm
            </text>
          </>
        )}
      </svg>

      {/* Rotation indicator */}
      {piece.allowRotation && (
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

export default AdvancedPiecePreview