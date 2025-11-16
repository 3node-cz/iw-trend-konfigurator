import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import type { CuttingPiece, MaterialSearchResult } from '../types/shopify'
import PieceShapePreview from './common/PieceShapePreview'

interface PiecePreviewDialogProps {
  open: boolean
  piece: CuttingPiece | null
  material?: MaterialSearchResult
  onClose: () => void
}

const PiecePreviewDialog: React.FC<PiecePreviewDialogProps> = ({
  open,
  piece,
  material,
  onClose,
}) => {
  if (!piece) return null

  // Calculate container dimensions to fill available space
  // The longer side always fills the maximum dimension
  const maxDimension = 800
  const aspectRatio = piece.length / piece.width
  let containerWidth: number
  let containerHeight: number

  if (aspectRatio > 1) {
    // Piece is longer than wide - length fills the height
    containerHeight = maxDimension
    containerWidth = maxDimension / aspectRatio
  } else {
    // Piece is wider than long or square - width fills the width
    containerWidth = maxDimension
    containerHeight = maxDimension * aspectRatio
  }

  // Ensure minimum visibility while maintaining aspect ratio
  const minDimension = 300
  if (containerWidth < minDimension || containerHeight < minDimension) {
    if (aspectRatio > 1) {
      containerWidth = minDimension
      containerHeight = minDimension * aspectRatio
    } else {
      containerHeight = minDimension
      containerWidth = minDimension / aspectRatio
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">
          Náhľad dielca:{' '}
          {piece.partName || `Dielec ${piece.length}×${piece.width}`}
        </Typography>
        <IconButton
          onClick={onClose}
          edge="end"
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          {/* Material name */}
          {material && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                {material.title}
              </Typography>
            </Box>
          )}

          {/* Piece shape preview */}
          <Box sx={{ mb: 3 }}>
            <PieceShapePreview
              piece={piece}
              containerWidth={containerWidth}
              containerHeight={containerHeight}
              backgroundImage={material?.image}
              backgroundOpacity={1.0}
            />
          </Box>

          {/* Piece dimensions */}
          <Box
            sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 1, color: 'primary.main' }}
            >
              Rozmery
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 4,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="body1">
                <strong>Dĺžka:</strong> {piece.length} mm
              </Typography>
              <Typography variant="body1">
                <strong>Šírka:</strong> {piece.width} mm
              </Typography>
              <Typography variant="body1">
                <strong>Množstvo:</strong> {piece.quantity} ks
              </Typography>
            </Box>
          </Box>

          {/* Piece information */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'center',
            }}
          >
            {piece.allowRotation && (
              <Typography
                variant="body2"
                sx={{ color: 'success.main' }}
              >
                <strong>Rotácia:</strong> Povolená
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
        >
          Zavrieť
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PiecePreviewDialog
