import React from 'react'
import { Box, Typography } from '@mui/material'
import type { CuttingPiece } from '../types/shopify'

interface PieceShapePreviewProps {
  piece: CuttingPiece
  containerSize?: number
}

const PieceShapePreview: React.FC<PieceShapePreviewProps> = ({
  piece,
  containerSize = 400
}) => {
  // Calculate scale so the longest dimension fills the container (with small padding for labels)
  const labelSpace = 30 // Space reserved for dimension labels
  const maxDimension = Math.max(piece.length, piece.width)
  const availableSpace = containerSize - (labelSpace * 2)
  const scale = availableSpace / maxDimension
  
  // Calculate actual display dimensions  
  // Dĺžka = first dimension, Šírka = second dimension
  // Match how they're displayed horizontally and vertically
  const displayWidth = piece.width * scale     // horizontal span
  const displayHeight = piece.length * scale   // vertical span
  
  // Calculate position to center the piece
  const offsetX = (containerSize - displayWidth) / 2
  const offsetY = (containerSize - displayHeight) / 2

  // Determine if piece should show edge indicators
  const hasEdges = piece.edgeAllAround || piece.edgeTop || piece.edgeBottom || 
                   piece.edgeLeft || piece.edgeRight

  return (
    <Box
      sx={{
        width: containerSize,
        height: containerSize,
        position: 'relative',
        mx: 'auto'
      }}
    >
      {/* Main piece rectangle */}
      <Box
        sx={{
          position: 'absolute',
          left: offsetX,
          top: offsetY,
          width: displayWidth,
          height: displayHeight,
          backgroundColor: '#ffffff',
          border: '2px solid #1976d2',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      />

      {/* Edge indicators */}
      {hasEdges && (
        <>
          {/* Top edge */}
          {(piece.edgeAllAround || piece.edgeTop) && (
            <Box
              sx={{
                position: 'absolute',
                left: offsetX,
                top: offsetY - 6,
                width: displayWidth,
                height: 4,
                backgroundColor: '#ff9800',
                borderRadius: '2px'
              }}
            />
          )}
          
          {/* Bottom edge */}
          {(piece.edgeAllAround || piece.edgeBottom) && (
            <Box
              sx={{
                position: 'absolute',
                left: offsetX,
                top: offsetY + displayHeight + 2,
                width: displayWidth,
                height: 4,
                backgroundColor: '#ff9800',
                borderRadius: '2px'
              }}
            />
          )}
          
          {/* Left edge */}
          {(piece.edgeAllAround || piece.edgeLeft) && (
            <Box
              sx={{
                position: 'absolute',
                left: offsetX - 6,
                top: offsetY,
                width: 4,
                height: displayHeight,
                backgroundColor: '#ff9800',
                borderRadius: '2px'
              }}
            />
          )}
          
          {/* Right edge */}
          {(piece.edgeAllAround || piece.edgeRight) && (
            <Box
              sx={{
                position: 'absolute',
                left: offsetX + displayWidth + 2,
                top: offsetY,
                width: 4,
                height: displayHeight,
                backgroundColor: '#ff9800',
                borderRadius: '2px'
              }}
            />
          )}
        </>
      )}

      {/* Dimension labels */}
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          top: offsetY - 20,
          left: offsetX + displayWidth / 2,
          transform: 'translateX(-50%)',
          color: '#666',
          fontWeight: 500
        }}
      >
        {piece.width} mm
      </Typography>
      
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          left: offsetX - 30,
          top: offsetY + displayHeight / 2,
          transform: 'translateY(-50%) rotate(-90deg)',
          color: '#666',
          fontWeight: 500,
          transformOrigin: 'center'
        }}
      >
        {piece.length} mm
      </Typography>

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

export default PieceShapePreview