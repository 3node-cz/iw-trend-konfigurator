import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Typography,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

interface NotesDialogProps {
  open: boolean
  initialValue: string
  onClose: () => void
  onSave: (notes: string) => void
}

const NotesDialog: React.FC<NotesDialogProps> = ({
  open,
  initialValue,
  onClose,
  onSave,
}) => {
  const [notes, setNotes] = useState(initialValue)

  useEffect(() => {
    if (open) {
      setNotes(initialValue)
    }
  }, [open, initialValue])

  const handleSave = () => {
    onSave(notes)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        pb: 2
      }}>
        <Typography variant="h6" component="div">
          Poznámka ku dielcu
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={6}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Zadajte poznámku ku dielcu..."
          autoFocus
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Zrušiť
        </Button>
        <Button onClick={handleSave} variant="contained">
          Uložiť
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NotesDialog
