import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import type { CuttingPiece } from '../types/shopify'
import PieceShapePreview from './PieceShapePreview'

interface PiecePreviewDialogProps {
  open: boolean
  piece: CuttingPiece | null
  onClose: () => void
}

const PiecePreviewDialog: React.FC<PiecePreviewDialogProps> = ({
  open,
  piece,
  onClose
}) => {
  if (!piece) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Náhľad dielca: {piece.partName || `Dielec ${piece.length}×${piece.width}`}
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
          {/* Piece shape preview */}
          <Box sx={{ mb: 3 }}>
            <PieceShapePreview piece={piece} containerSize={400} />
          </Box>
          
          {/* Piece information */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
            {piece.allowRotation && (
              <Typography variant="body2" sx={{ color: 'success.main' }}>
                <strong>Rotácia:</strong> Povolená
              </Typography>
            )}
            {piece.notes && (
              <Typography variant="body2">
                <strong>Poznámka:</strong> {piece.notes}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Zavrieť
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PiecePreviewDialog