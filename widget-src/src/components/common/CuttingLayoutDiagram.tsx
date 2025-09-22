import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import type { CuttingLayout } from '../../utils/guillotineCutting'

interface CuttingLayoutDiagramProps {
  layout: CuttingLayout
  title?: string
  maxWidth?: number
  maxHeight?: number
  globalPieceTypes?: string[] // Optional: piece types from all layouts for consistent coloring
}

const CuttingLayoutDiagram: React.FC<CuttingLayoutDiagramProps> = ({
  layout,
  title = 'Rozrez materiálu',
  maxWidth = 800,
  maxHeight = 600,
  globalPieceTypes,
}) => {
  // Calculate scale to fit the diagram
  const scaleX = maxWidth / layout.boardWidth
  const scaleY = maxHeight / layout.boardHeight
  const scale = Math.min(scaleX, scaleY, 1) // Don't scale up, only down

  const svgWidth = layout.boardWidth * scale
  const svgHeight = layout.boardHeight * scale

  // Color palette for different piece types (use brighter, more distinct colors)
  const rowColors = [
    '#E3F2FD', // Light blue
    '#F3E5F5', // Light purple
    '#E8F5E8', // Light green
    '#FFF3E0', // Light orange
    '#FCE4EC', // Light pink
    '#E0F2F1', // Light teal
    '#F1F8E9', // Light lime
    '#FFF8E1', // Light yellow
    '#E8EAF6', // Light indigo
    '#FFEBEE', // Light red
  ]

  // Use global piece types if provided, otherwise calculate from current layout
  const uniquePieceTypes = globalPieceTypes || [
    ...new Set(
      layout.placedPieces.map(
        (p) => p.originalPiece.partName || p.originalPiece.id,
      ),
    ),
  ]

  const getPieceColor = (piece: {
    originalPiece: { partName?: string; id: string }
  }) => {
    const pieceType = piece.originalPiece.partName || piece.originalPiece.id
    const typeIndex = uniquePieceTypes.indexOf(pieceType)
    const color = rowColors[typeIndex % rowColors.length]
    return color
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 600 }}
      >
        {title}
      </Typography>

      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {/* SVG Cutting Diagram */}
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${layout.boardWidth} ${layout.boardHeight}`}
          style={{
            border: '2px solid #333',
            backgroundColor: '#fafafa',
          }}
        >
          {/* Board outline */}
          <rect
            x={0}
            y={0}
            width={layout.boardWidth}
            height={layout.boardHeight}
            fill="none"
            stroke="#333"
            strokeWidth="2"
          />

          {/* Waste areas with hatching pattern */}
          <defs>
            <pattern
              id="wastePattern"
              patternUnits="userSpaceOnUse"
              width="10"
              height="10"
            >
              <rect
                width="10"
                height="10"
                fill="#f0f0f0"
              />
              <path
                d="M0,10 L10,0"
                stroke="#ccc"
                strokeWidth="1"
              />
              <path
                d="M-2,2 L2,-2"
                stroke="#ccc"
                strokeWidth="1"
              />
              <path
                d="M8,12 L12,8"
                stroke="#ccc"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          {layout.wasteAreas.map((waste) => (
            <rect
              key={waste.id}
              x={waste.x}
              y={waste.y}
              width={waste.width}
              height={waste.height}
              fill="url(#wastePattern)"
              stroke="#ccc"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          ))}

          {/* Cut lines */}
          {layout.cutLines.map((cutLine) => (
            <line
              key={cutLine.id}
              x1={cutLine.x1}
              y1={cutLine.y1}
              x2={cutLine.x2}
              y2={cutLine.y2}
              stroke="#ff4444"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity={0.7}
            />
          ))}

          {/* Pieces */}
          {layout.placedPieces.map((piece, index) => {
            const centerX = piece.x + piece.width / 2
            const centerY = piece.y + piece.height / 2
            const fontSize = Math.min(piece.width / 8, piece.height / 4, 60)

            return (
              <g key={`${piece.id}_${index}`}>
                {/* Piece rectangle */}
                <rect
                  x={piece.x}
                  y={piece.y}
                  width={piece.width}
                  height={piece.height}
                  fill={getPieceColor(piece)}
                  stroke="#333"
                  strokeWidth="1.5"
                />

                {/* Piece label */}
                <text
                  x={centerX}
                  y={centerY - fontSize / 2}
                  textAnchor="middle"
                  fontSize={fontSize}
                  fill="#333"
                  fontWeight="600"
                >
                  {piece.name}
                </text>

                {/* Piece dimensions */}
                <text
                  x={centerX}
                  y={centerY + fontSize / 2 + 2}
                  textAnchor="middle"
                  fontSize={fontSize * 0.8}
                  fill="#666"
                >
                  {piece.width}×{piece.height}
                </text>

                {/* Rotation indicator */}
                {piece.rotated && (
                  <text
                    x={piece.x + 15}
                    y={piece.y + fontSize + 15}
                    fontSize={fontSize * 0.7}
                    fill="#ff6600"
                    fontWeight="600"
                  >
                    ↻
                  </text>
                )}
              </g>
            )
          })}

          {/* Board dimensions */}
          <text
            x={layout.boardWidth / 2}
            y={-15}
            textAnchor="middle"
            fontSize="48"
            fill="#333"
            fontWeight="600"
          >
            {layout.boardWidth} mm
          </text>

          <text
            x={-15}
            y={layout.boardHeight / 2}
            textAnchor="middle"
            fontSize="48"
            fill="#333"
            fontWeight="600"
            transform={`rotate(-90, -15, ${layout.boardHeight / 2})`}
          >
            {layout.boardHeight} mm
          </text>
        </svg>

        {/* Statistics */}
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            gap: 4,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              color="success.main"
              sx={{ fontWeight: 600 }}
            >
              {layout.efficiency.toFixed(1)}%
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Efektivita využitia
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              {layout.placedPieces.length}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Umiestnených kusov
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              color="warning.main"
              sx={{ fontWeight: 600 }}
            >
              {((layout.totalWasteArea / 1000000) * 100).toFixed(2)} m²
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Odpad
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              color="info.main"
              sx={{ fontWeight: 600 }}
            >
              {layout.cutLines.length}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Počet rezov
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default CuttingLayoutDiagram
