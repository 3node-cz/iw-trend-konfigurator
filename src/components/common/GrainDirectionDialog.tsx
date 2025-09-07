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
import WoodGrainVisualization from './WoodGrainVisualization'

interface GrainDirectionDialogProps {
  open: boolean
  onClose: () => void
}

const GrainDirectionDialog: React.FC<GrainDirectionDialogProps> = ({
  open,
  onClose
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 2
      }}>
        <Typography variant="h6" component="div">
          Forma hranenia
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pb: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Smer vlákien dreva určuje, ako sa materiál reže a ako sa aplikujú hrany:
          </Typography>
          
          {/* Horizontal grain example */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Horizontálne vlákna (štandardné)
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <WoodGrainVisualization 
                width={250}
                height={140}
                grainDirection="horizontal"
                showLabels={false}
                showArrows={true}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Vlákna dreva idú horizontálne - štandardná orientácia pre väčšinu aplikácií
            </Typography>
          </Box>
          
          {/* Vertical grain example */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Vertikálne vlákna
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <WoodGrainVisualization 
                width={250}
                height={140}
                grainDirection="vertical"
                showLabels={false}
                showArrows={true}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Vlákna dreva idú vertikálne - používa sa pre špeciálne aplikácie
            </Typography>
          </Box>
          
          {/* Additional info */}
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            backgroundColor: '#f5f5f5', 
            borderRadius: 1,
            textAlign: 'left'
          }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Poznámka:</strong> Smer vlákien ovplyvňuje:
              <br />• Pevnosť a stabilitu materiálu
              <br />• Spôsob aplikácie hrán
              <br />• Celkový vzhľad hotového produktu
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="contained">
          Zavrieť
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GrainDirectionDialog