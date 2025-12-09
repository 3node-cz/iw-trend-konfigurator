import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box
} from '@mui/material'
import {
  Close as CloseIcon
} from '@mui/icons-material'
import type { MaterialSearchResult } from '../types/shopify'
import MaterialResultsTable from './MaterialResultsTable'

interface MaterialAllResultsModalProps {
  open: boolean
  onClose: () => void
  results: MaterialSearchResult[]
  onAddMaterial?: (material: MaterialSearchResult) => void
  selectedMaterialIds?: string[]
}

const MaterialAllResultsModal: React.FC<MaterialAllResultsModalProps> = ({
  open,
  onClose,
  results,
  onAddMaterial,
  selectedMaterialIds = []
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: { 
          minHeight: '70vh',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ color: 'primary.main', fontWeight: 600 }}>
          Všetky výsledky vyhľadávania ({results.length})
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          <MaterialResultsTable
            results={results}
            onAddMaterial={onAddMaterial}
            showViewAllButton={false}
            isSelectedMaterials={false}
            selectedMaterialIds={selectedMaterialIds}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Zavrieť
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MaterialAllResultsModal