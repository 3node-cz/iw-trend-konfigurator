import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
} from '@mui/material'
import {
  Close as CloseIcon,
} from '@mui/icons-material'
import CuttingLayoutDiagram from './CuttingLayoutDiagram'
import type { CuttingLayout } from '../../utils/guillotineCutting'

interface CuttingDiagramDialogProps {
  open: boolean
  layout: CuttingLayout | null
  title: string
  onClose: () => void
  globalPieceTypes?: string[] // Optional: piece types from all layouts for consistent coloring
}

const CuttingDiagramDialog: React.FC<CuttingDiagramDialogProps> = ({
  open,
  layout,
  title,
  onClose,
  globalPieceTypes,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '80vh',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Box sx={{ fontWeight: 600, color: 'primary.main' }}>{title}</Box>
        <IconButton
          onClick={onClose}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {layout && (
          <CuttingLayoutDiagram
            layout={layout}
            title=""
            maxWidth={1000}
            maxHeight={700}
            globalPieceTypes={globalPieceTypes}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
        >
          Zavrieť
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CuttingDiagramDialog
