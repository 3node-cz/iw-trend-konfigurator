import React, { useState } from 'react'
import { 
  Box, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography 
} from '@mui/material'
import { HelpOutline as HelpIcon, Close as CloseIcon } from '@mui/icons-material'

interface HeaderWithHintProps {
  title: string
  hintTitle: string
  hintContent: React.ReactNode
}

const HeaderWithHint: React.FC<HeaderWithHintProps> = ({ 
  title, 
  hintTitle, 
  hintContent 
}) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="inherit" component="span">
          {title}
        </Typography>
        <IconButton
          size="small"
          onClick={handleOpen}
          sx={{ 
            p: 0.25, 
            fontSize: '0.75rem',
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main'
            }
          }}
        >
          <HelpIcon fontSize="inherit" />
        </IconButton>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          py: 3, 
          px: 3
        }}>
          <Typography variant="h6" component="div">
            {hintTitle}
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ py: 3, px: 3 }}>
          {hintContent}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} variant="contained">
            Zavrieť
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default HeaderWithHint