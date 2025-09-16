import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import type { CuttingLayout } from '../../utils/guillotineCutting'

interface CuttingDiagramThumbnailProps {
  layout: CuttingLayout
  title: string
  onClick: () => void
  globalPieceTypes?: string[] // Optional: piece types from all layouts for consistent coloring
}

const CuttingDiagramThumbnail: React.FC<CuttingDiagramThumbnailProps> = ({ 
  layout, 
  title,
  onClick,
  globalPieceTypes
}) => {
  // Small thumbnail size
  const thumbnailWidth = 200
  const thumbnailHeight = 150

  // Calculate scale to fit the thumbnail
  const scaleX = thumbnailWidth / layout.boardWidth
  const scaleY = thumbnailHeight / layout.boardHeight
  const scale = Math.min(scaleX, scaleY)

  const svgWidth = layout.boardWidth * scale
  const svgHeight = layout.boardHeight * scale

  // Color palette for different piece types
  const rowColors = [
    '#E3F2FD', '#F3E5F5', '#E8F5E8', '#FFF3E0', '#FCE4EC', 
    '#E0F2F1', '#F1F8E9', '#FFF8E1', '#E8EAF6', '#FFEBEE'
  ]

  // Use global piece types if provided, otherwise calculate from current layout
  const uniquePieceTypes = globalPieceTypes || [...new Set(layout.placedPieces.map(p => p.originalPiece.partName || p.originalPiece.id))]
  
  const getPieceColor = (piece: { originalPiece: { partName?: string; id: string } }) => {
    const pieceType = piece.originalPiece.partName || piece.originalPiece.id
    const typeIndex = uniquePieceTypes.indexOf(pieceType)
    return rowColors[typeIndex % rowColors.length]
  }

  return (
    <Paper 
      sx={{ 
        p: 2, 
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 4
        }
      }}
      onClick={onClick}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, textAlign: 'center' }}>
        {title}
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <svg 
          width={svgWidth} 
          height={svgHeight}
          viewBox={`0 0 ${layout.boardWidth} ${layout.boardHeight}`}
          style={{
            border: '1px solid #333',
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
            strokeWidth="4"
          />

          {/* Waste areas with hatching pattern */}
          <defs>
            <pattern id={`wastePattern-${layout.boardWidth}-${layout.boardHeight}`} patternUnits="userSpaceOnUse" width="20" height="20">
              <rect width="20" height="20" fill="#f0f0f0"/>
              <path d="M0,20 L20,0" stroke="#ccc" strokeWidth="2"/>
              <path d="M-4,4 L4,-4" stroke="#ccc" strokeWidth="2"/>
              <path d="M16,24 L24,16" stroke="#ccc" strokeWidth="2"/>
            </pattern>
          </defs>

          {layout.wasteAreas.map((waste) => (
            <rect
              key={waste.id}
              x={waste.x}
              y={waste.y}
              width={waste.width}
              height={waste.height}
              fill={`url(#wastePattern-${layout.boardWidth}-${layout.boardHeight})`}
              stroke="#ccc"
              strokeWidth="2"
              strokeDasharray="6,6"
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
              strokeWidth="3"
              strokeDasharray="10,10"
              opacity={0.7}
            />
          ))}

          {/* Pieces - simplified for thumbnail */}
          {layout.placedPieces.map((piece, index) => (
            <rect
              key={`${piece.id}_${index}`}
              x={piece.x}
              y={piece.y}
              width={piece.width}
              height={piece.height}
              fill={getPieceColor(piece)}
              stroke="#333"
              strokeWidth="2"
            />
          ))}
        </svg>
      </Box>

      {/* Thumbnail stats */}
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
        <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
          {layout.efficiency.toFixed(1)}%
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {layout.placedPieces.length} kusov
        </Typography>
      </Box>
    </Paper>
  )
}

export default CuttingDiagramThumbnail