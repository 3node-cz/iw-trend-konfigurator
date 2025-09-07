import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Switch,
  FormControlLabel,
  Typography,
  IconButton,
  Alert
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import Grid from '@mui/system/Grid'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { z } from 'zod'
import { orderSchema, type OrderFormData, getFieldErrors } from '../schemas/orderSchema'
import { FormTextField, FormSelect } from './common'

interface CreateOrderModalProps {
  open: boolean
  onClose: () => void
  onOrderCreated?: (orderData: OrderFormData) => void
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ open, onClose, onOrderCreated }) => {
  const [formData, setFormData] = useState<OrderFormData>({
    company: 'IW TREND, s.r.o',
    transferLocation: '',
    costCenter: '',
    cuttingCenter: '',
    orderName: '',
    deliveryDate: null,
    materialType: '',
    deliveryMethod: '',
    processingType: '',
    withoutEdges: false,
    bandingFree: false,
    palettePayment: false,
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const locations = [
    'ZIL - IW TREND, s.r.o., K cintorínu, Žilina',
    'DCD - IW TREND, s.r.o., Lieskavská cesta 20, Žilina',
    'PAR - IW TREND, s.r.o., Nitrianska cesta 50360, CEBO HOLDING, Partizánske',
    'CEN - IW TREND, s.r.o., Pri majerí 6, Bratislava'
  ]

  const materialTypes = [
    'PUR biela',
    'PUR transparentná/biela'
  ]

  const deliveryMethods = [
    'Démos odvoz'
  ]

  const processingTypes = [
    'Formátovať',
    'Ukládať',
    'Zlikvidovať'
  ]

  const handleSubmit = () => {
    try {
      // Validate form with Zod
      const validatedData = orderSchema.parse(formData)
      
      // Clear errors if validation passes
      setErrors({})

      // Handle form submission
      console.log('Validated form data:', validatedData)
      onOrderCreated?.(validatedData)
      onClose()
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        console.log('Validation errors:', error.issues)
        const fieldErrors = getFieldErrors(error)
        console.log('Field errors:', fieldErrors)
        setErrors(fieldErrors)
      }
    }
  }

  const clearFieldError = (field: keyof OrderFormData) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const handleFieldChange = (field: keyof OrderFormData) => (event: any) => {
    const value = event.target.value
    
    // Clear error for this field when user makes changes
    clearFieldError(field)
    
    // Real-time validation for this field only
    if (value.trim()) {
      try {
        const fieldSchema = orderSchema.shape[field]
        if (fieldSchema) {
          fieldSchema.parse(value)
        }
      } catch (error) {
        // Field is still invalid, but don't show error until form submit
      }
    }
    
    if (field === 'transferLocation') {
      // Extract city from the selected location
      let city = ''
      if (value.includes('Žilina')) {
        city = 'Žilina'
      } else if (value.includes('Partizánske')) {
        city = 'Partizánske'
      } else if (value.includes('Bratislava')) {
        city = 'Bratislava'
      }
      
      // Clear errors for auto-populated fields too
      clearFieldError('costCenter')
      clearFieldError('cuttingCenter')
      
      // Update all three fields
      setFormData(prev => ({
        ...prev,
        [field]: value,
        costCenter: city,
        cuttingCenter: city
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleCheckboxChange = (field: keyof OrderFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked
    }))
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ color: '#1976d2', fontWeight: 600 }}>
            Zákazka formátovania
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Prevádzková jednotka a nárezové centrum nie je možné v priebežnej zadávaní a editácii zákazky zmeniť
          </Alert>

          <Grid container spacing={3}>
            {/* Customer Information */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormTextField
                label="Zákazník"
                value={formData.company}
                onChange={handleFieldChange('company')}
                error={errors.company}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormSelect
                label="Prevádzková jednotka"
                value={formData.transferLocation}
                onChange={handleFieldChange('transferLocation')}
                options={locations}
                error={errors.transferLocation}
                required
              />
            </Grid>

            {/* Branch and Cost Center */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormSelect
                label="Pobočka"
                value={formData.costCenter}
                onChange={handleFieldChange('costCenter')}
                options={['Bratislava', 'Žilina', 'Partizánske']}
                error={errors.costCenter}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormSelect
                label="Nárezové centrum"
                value={formData.cuttingCenter}
                onChange={handleFieldChange('cuttingCenter')}
                options={['Bratislava', 'Žilina', 'Partizánske']}
                error={errors.cuttingCenter}
                required
              />
            </Grid>

            {/* Order Details */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormTextField
                label="Názov zákazky"
                value={formData.orderName}
                onChange={handleFieldChange('orderName')}
                placeholder="Aricoma"
                error={errors.orderName}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <DatePicker
                label="Požadovaný dátum dodania"
                value={formData.deliveryDate}
                onChange={(date) => {
                  // Clear error when date is selected
                  clearFieldError('deliveryDate')
                  setFormData(prev => ({ ...prev, deliveryDate: date }))
                }}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    required: true,
                    error: !!errors.deliveryDate,
                    helperText: errors.deliveryDate
                  }
                }}
              />
            </Grid>

            {/* Material and Delivery */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormSelect
                label="Typ lepidla"
                value={formData.materialType}
                onChange={handleFieldChange('materialType')}
                options={materialTypes}
                error={errors.materialType}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.withoutEdges}
                    onChange={handleCheckboxChange('withoutEdges')}
                  />
                }
                label="Bez orezu"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormSelect
                label="Spôsob dopravy"
                value={formData.deliveryMethod}
                onChange={handleFieldChange('deliveryMethod')}
                options={deliveryMethods}
                error={errors.deliveryMethod}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.palettePayment}
                    onChange={handleCheckboxChange('palettePayment')}
                  />
                }
                label="Zabaliť na paletách"
              />
            </Grid>

            {/* Processing Options */}
            <Grid size={{ xs: 12 }}>
              <FormSelect
                label="Spracovanie zbytkov"
                value={formData.processingType}
                onChange={handleFieldChange('processingType')}
                options={processingTypes}
                error={errors.processingType}
                required
              />
            </Grid>

            {/* Notes */}
            <Grid size={{ xs: 12 }}>
              <FormTextField
                label="Poznámka"
                value={formData.notes}
                onChange={handleFieldChange('notes')}
                multiline
                rows={3}
                placeholder="Zadajte poznámku..."
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Vytvoriť
          </Button>
        </DialogActions>
    </Dialog>
  )
}

export default CreateOrderModal