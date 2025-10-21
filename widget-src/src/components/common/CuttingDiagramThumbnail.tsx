import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import type { CuttingLayout } from '../../utils/guillotineCutting'

interface CuttingDiagramThumbnailProps {
  layout: CuttingLayout
  title: string
  onClick: () => void
  globalPieceTypes?: string[]
  count?: number
  description?: string
}

const CuttingDiagramThumbnail: React.FC<CuttingDiagramThumbnailProps> = ({
  layout,
  title,
  onClick,
  globalPieceTypes,
  count,
  description,
}) => {
  const thumbnailWidth = 200
  const thumbnailHeight = 150

  const scaleX = thumbnailWidth / layout.boardWidth
  const scaleY = thumbnailHeight / layout.boardHeight
  const scale = Math.min(scaleX, scaleY)

  const svgWidth = layout.boardWidth * scale
  const svgHeight = layout.boardHeight * scale
  const rowColors = [
    { fill: '#E3F2FD', stroke: '#2196F3' }, // Light blue / Blue
    { fill: '#F3E5F5', stroke: '#9C27B0' }, // Light purple / Purple
    { fill: '#E8F5E8', stroke: '#4CAF50' }, // Light green / Green
    { fill: '#FFF3E0', stroke: '#FF9800' }, // Light orange / Orange
    { fill: '#FCE4EC', stroke: '#E91E63' }, // Light pink / Pink
    { fill: '#E0F2F1', stroke: '#009688' }, // Light teal / Teal
    { fill: '#F1F8E9', stroke: '#8BC34A' }, // Light lime / Lime
    { fill: '#FFF8E1', stroke: '#FFC107' }, // Light yellow / Yellow
    { fill: '#E8EAF6', stroke: '#3F51B5' }, // Light indigo / Indigo
    { fill: '#FFEBEE', stroke: '#F44336' }, // Light red / Red
  ]

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
    const colorIndex = typeIndex >= 0 ? typeIndex : 0
    return rowColors[colorIndex % rowColors.length]
  }

  return (
    <Paper
      sx={{
        p: 2,
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 280, // Ensure consistent height
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 4,
        },
      }}
      onClick={onClick}
    >
      {count && count > 1 && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'primary.main',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 600,
            minWidth: '24px',
            height: '24px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            boxShadow: 2,
          }}
        >
          ×{count}
        </Box>
      )}

      <Typography
        variant="h6"
        sx={{
          mb: 1,
          fontWeight: 700,
          textAlign: 'center',
          fontSize: '1.25rem',
          color: 'primary.main'
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            textAlign: 'center',
            mb: 1,
            fontSize: '0.65rem',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {description}
        </Typography>
      )}

      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: description ? 0 : 'auto',
        flexGrow: description ? 0 : 1,
        alignItems: description ? 'flex-start' : 'flex-end'
      }}>
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${layout.boardWidth} ${layout.boardHeight}`}
          style={{
            border: '1px solid #333',
            backgroundColor: '#fafafa',
          }}
        >
          <rect
            x={0}
            y={0}
            width={layout.boardWidth}
            height={layout.boardHeight}
            fill="none"
            stroke="#333"
            strokeWidth="4"
          />
          <defs>
            <pattern
              id={`wastePattern-${layout.boardWidth}-${layout.boardHeight}`}
              patternUnits="userSpaceOnUse"
              width="20"
              height="20"
            >
              <rect
                width="20"
                height="20"
                fill="#f0f0f0"
              />
              <path
                d="M0,20 L20,0"
                stroke="#ccc"
                strokeWidth="2"
              />
              <path
                d="M-4,4 L4,-4"
                stroke="#ccc"
                strokeWidth="2"
              />
              <path
                d="M16,24 L24,16"
                stroke="#ccc"
                strokeWidth="2"
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
              fill={`url(#wastePattern-${layout.boardWidth}-${layout.boardHeight})`}
              stroke="#ccc"
              strokeWidth="2"
              strokeDasharray="6,6"
            />
          ))}

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

          {layout.placedPieces.map((piece, index) => {
            const colors = getPieceColor(piece)
            return (
              <rect
                key={`${piece.id}_${index}`}
                x={piece.x}
                y={piece.y}
                width={piece.width}
                height={piece.height}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth="2"
              />
            )
          })}
        </svg>
      </Box>

      <Box
        sx={{
          mt: 1,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
        }}
      >
        <Typography
          variant="caption"
          color="success.main"
          sx={{ fontWeight: 600 }}
        >
          {layout.efficiency.toFixed(1)}%
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {layout.placedPieces.length} kusov
        </Typography>
      </Box>
    </Paper>
  )
}

export default CuttingDiagramThumbnail
