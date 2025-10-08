import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  IconButton
} from '@mui/material'
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material'
import { createConfigurationService } from '../../services/configurationService'
import type { OrderFormData } from '../../schemas/orderSchema'
import type { CuttingSpecification, SelectedMaterial } from '../../types/shopify'
import type { AppView } from '../../types/optimized-saved-config'

interface SaveOrderButtonProps {
  currentStep: AppView
  orderData: OrderFormData | null
  selectedMaterials: SelectedMaterial[]
  cuttingSpecifications: CuttingSpecification[]
  customerId?: string
  disabled?: boolean
  variant?: 'text' | 'outlined' | 'contained'
  size?: 'small' | 'medium' | 'large'
  onSaveSuccess?: () => void
  onSaveError?: (error: string) => void
}

const SaveOrderButton: React.FC<SaveOrderButtonProps> = ({
  currentStep,
  orderData,
  selectedMaterials,
  cuttingSpecifications,
  customerId,
  disabled = false,
  variant = 'outlined',
  size = 'small',
  onSaveSuccess,
  onSaveError
}) => {
  const [open, setOpen] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpen = () => {
    // Generate default name based on current step and order data
    const stepNames = {
      'orders': 'Prázdna zákazka',
      'material-selection': 'Výber materiálov',
      'cutting-specification': 'Špecifikácia rezania',
      'recapitulation': 'Kompletná zákazka',
      'success': 'Dokončená zákazka',
      'cutting-demo': 'Demo nárez'
    }

    const baseName = orderData?.orderName || 'Nová zákazka'
    const stepName = stepNames[currentStep] || 'Neuložené'
    setSaveName(`${baseName} - ${stepName}`)
    setError(null)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSaveName('')
    setError(null)
  }

  const handleSave = async () => {
    if (!saveName.trim()) {
      setError('Názov je povinný')
      return
    }

    if (!orderData) {
      setError('Nie sú k dispozícii údaje objednávky')
      return
    }

    if (!customerId) {
      setError('Musíte byť prihlásený na uloženie zákazky')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const configService = createConfigurationService()

      // Convert selected materials to the format expected by the service
      const materials = selectedMaterials.map(material => ({
        id: material.id,
        code: material.code,
        name: material.name,
        quantity: material.quantity,
        price: material.price
      }))

      const result = await configService.saveConfiguration(
        customerId,
        saveName.trim(),
        orderData,
        materials,
        cuttingSpecifications,
        currentStep
      )

      if (result.success) {
        onSaveSuccess?.()
        handleClose()
      } else {
        setError(result.error || 'Chyba pri ukladaní zákazky')
        onSaveError?.(result.error || 'Chyba pri ukladaní zákazky')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Neočakávaná chyba'
      setError(errorMessage)
      onSaveError?.(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  // Show save button but disable it if no order data

  return (
    <>
      <Button
        variant={variant}
        size={size}
        startIcon={<SaveIcon />}
        onClick={handleOpen}
        disabled={disabled || !orderData}
      >
        Uložiť
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ color: 'primary.main', fontWeight: 600 }}>
            Uložiť zákazku
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Keď túto zákazku načítate neskôr, automaticky sa vráti na tento krok s uloženými údajmi.
          </Typography>

          <TextField
            autoFocus
            fullWidth
            label="Názov uloženej zákazky"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            error={!!error}
            helperText={error || 'Zadajte popisný názov pre túto zákazku'}
            disabled={saving}
            sx={{ mb: 2 }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={saving}>
            Zrušiť
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !saveName.trim()}
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            {saving ? 'Ukladám...' : 'Uložiť'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SaveOrderButton