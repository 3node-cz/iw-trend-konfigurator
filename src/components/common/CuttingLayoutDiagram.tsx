import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import type { CuttingLayout } from '../../utils/guillotineCutting'

interface CuttingLayoutDiagramProps {
  layout: CuttingLayout
  title?: string
  maxWidth?: number
  maxHeight?: number
}

const CuttingLayoutDiagram: React.FC<CuttingLayoutDiagramProps> = ({ 
  layout, 
  title = "Rozrez materiálu",
  maxWidth = 800,
  maxHeight = 600
}) => {
  // Calculate scale to fit the diagram
  const scaleX = maxWidth / layout.boardWidth
  const scaleY = maxHeight / layout.boardHeight
  const scale = Math.min(scaleX, scaleY, 1) // Don't scale up, only down

  const svgWidth = layout.boardWidth * scale
  const svgHeight = layout.boardHeight * scale

  // Color palette for different rows/groups
  const rowColors = [
    '#E3F2FD', '#F3E5F5', '#E8F5E8', '#FFF3E0', '#FCE4EC', 
    '#E0F2F1', '#F1F8E9', '#FFF8E1', '#E8EAF6', '#FFEBEE'
  ]

  // Create a mapping from row/group identifier to color index
  const getRowIdentifier = (piece: any) => {
    // Use groupId if available (for grouped pieces)
    if (piece.groupId) {
      return piece.groupId
    }
    // Fallback to piece name for row grouping (extract base name without numbers)
    return piece.name.replace(/\s*\d+$/, '').trim()
  }

  // Get unique row identifiers and assign colors
  const uniqueRows = [...new Set(layout.placedPieces.map(getRowIdentifier))]
  const rowColorMap = new Map()
  uniqueRows.forEach((rowId, index) => {
    rowColorMap.set(rowId, rowColors[index % rowColors.length])
  })

  const getPieceColor = (piece: any) => {
    const rowId = getRowIdentifier(piece)
    return rowColorMap.get(rowId) || rowColors[0]
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {title}
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* SVG Cutting Diagram */}
        <svg 
          width={svgWidth} 
          height={svgHeight}
          viewBox={`0 0 ${layout.boardWidth} ${layout.boardHeight}`}
          style={{
            border: '2px solid #333',
            backgroundColor: '#fafafa'
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
            <pattern id="wastePattern" patternUnits="userSpaceOnUse" width="10" height="10">
              <rect width="10" height="10" fill="#f0f0f0"/>
              <path d="M0,10 L10,0" stroke="#ccc" strokeWidth="1"/>
              <path d="M-2,2 L2,-2" stroke="#ccc" strokeWidth="1"/>
              <path d="M8,12 L12,8" stroke="#ccc" strokeWidth="1"/>
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
          {layout.placedPieces.map((piece) => {
            const centerX = piece.x + piece.width / 2
            const centerY = piece.y + piece.height / 2
            const fontSize = Math.min(piece.width / 8, piece.height / 4, 60)
            
            return (
              <g key={piece.id}>
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
                  y={centerY - fontSize/2}
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
                  y={centerY + fontSize/2 + 2}
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
        <Box sx={{ mt: 3, display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
              {layout.efficiency.toFixed(1)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Efektivita využitia
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              {layout.placedPieces.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Umiestnených kusov
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="warning.main" sx={{ fontWeight: 600 }}>
              {((layout.totalWasteArea / 1000000) * 100).toFixed(2)} m²
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Odpad
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="info.main" sx={{ fontWeight: 600 }}>
              {layout.cutLines.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Počet rezov
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default CuttingLayoutDiagram