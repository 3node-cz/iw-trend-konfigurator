import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip
} from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  ShoppingCart as ShoppingCartIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  BookmarkAdd as BookmarkAddIcon
} from '@mui/icons-material'
import type { OrderFormData } from '../schemas/orderSchema'
import type { CuttingSpecification } from '../types/shopify'
import { formatPriceNumber } from '../utils/formatting'
import { createConfigurationService } from '../services/configurationService'
import { useCustomer } from '../hooks/useCustomer'

interface OrderSuccessPageProps {
  checkoutUrl: string
  orderName: string
  orderInfo?: OrderFormData
  materials?: Array<{ id: string; code: string; name: string; quantity: number; price: number }>
  specifications?: CuttingSpecification[]
  onCreateNewOrder?: () => void
}

const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  checkoutUrl,
  orderName,
  orderInfo,
  materials,
  specifications,
  onCreateNewOrder
}) => {
  const { customer, isLoggedIn } = useCustomer()
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [configurationName, setConfigurationName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const canSaveConfiguration = isLoggedIn && customer && orderInfo && materials && specifications

  const handleSaveConfiguration = async () => {
    if (!canSaveConfiguration || !configurationName.trim()) return

    setSaving(true)
    setSaveMessage(null)

    try {
      const configService = createConfigurationService()
      const result = await configService.saveConfiguration(
        customer.id,
        configurationName.trim(),
        orderInfo,
        materials,
        specifications
      )

      if (result.success) {
        setSaveMessage({
          type: 'success',
          text: 'Konfigurácia bola úspešne uložená!'
        })
        setConfigurationName('')
        setTimeout(() => {
          setSaveDialogOpen(false)
          setSaveMessage(null)
        }, 2000)
      } else {
        setSaveMessage({
          type: 'error',
          text: result.error || 'Chyba pri ukladaní konfigurácie'
        })
      }
    } catch (error) {
      setSaveMessage({
        type: 'error',
        text: 'Neočakávaná chyba pri ukladaní konfigurácie'
      })
    }

    setSaving(false)
  }

  const calculateSummary = () => {
    if (!materials || !specifications) return null

    const totalPieces = specifications.reduce((sum, spec) =>
      sum + spec.pieces.reduce((pieceSum, piece) => pieceSum + piece.quantity, 0), 0
    )
    const totalCost = materials.reduce((sum, material) =>
      sum + (material.price * material.quantity), 0
    )

    return { totalPieces, totalCost }
  }

  const summary = calculateSummary()

  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Paper sx={{ p: 6, borderRadius: 2 }}>
        <CheckCircleIcon sx={{ fontSize: 100, color: 'success.main', mb: 3 }} />

        <Typography variant="h4" sx={{ color: 'success.main', mb: 2, fontWeight: 600 }}>
          Zákazka bola úspešne pridaná do košíka!
        </Typography>

        <Typography variant="h6" sx={{ mb: 4, fontWeight: 500 }}>
          "{orderName}"
        </Typography>

        {/* Save Configuration Section */}
        {canSaveConfiguration && (
          <Card sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <BookmarkAddIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Uložiť konfiguráciu
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Uložte si túto konfiguráciu pre budúce použitie
              </Typography>


              <Button
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={() => setSaveDialogOpen(true)}
                fullWidth
                sx={{ mt: 1 }}
              >
                Uložiť konfiguráciu
              </Button>
            </CardContent>
          </Card>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCartIcon />}
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              minWidth: 250,
              py: 1.5,
              fontSize: '1.1rem',
              bgcolor: 'success.main',
              '&:hover': {
                bgcolor: 'success.dark'
              }
            }}
          >
            Otvoriť košík a dokončiť objednávku
          </Button>

          {onCreateNewOrder && (
            <Button
              variant="outlined"
              size="large"
              startIcon={<RefreshIcon />}
              onClick={onCreateNewOrder}
              sx={{
                minWidth: 200,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Vytvoriť novú zákazku
            </Button>
          )}
        </Box>
      </Paper>

      {/* Save Configuration Dialog */}
      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {saveMessage?.type === 'success' ? 'Konfigurácia uložená' : 'Uložiť konfiguráciu'}
        </DialogTitle>
        <DialogContent>
          {saveMessage ? (
            <Alert
              severity={saveMessage.type}
              sx={{ mb: 2 }}
            >
              {saveMessage.text}
            </Alert>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                Zadajte názov pre túto konfiguráciu. Budete si ju môcť neskôr znovu načítať.
              </Typography>

              <TextField
                autoFocus
                label="Názov konfigurácie"
                fullWidth
                value={configurationName}
                onChange={(e) => setConfigurationName(e.target.value)}
                placeholder="napr. Kuchynské skrinky - projekt 2024"
                disabled={saving}
                error={!configurationName.trim() && configurationName.length > 0}
                helperText={!configurationName.trim() && configurationName.length > 0 ? 'Názov je povinný' : ''}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          {saveMessage?.type === 'success' ? (
            <Button
              onClick={() => setSaveDialogOpen(false)}
              variant="contained"
            >
              Zavrieť
            </Button>
          ) : (
            <>
              <Button
                onClick={() => setSaveDialogOpen(false)}
                disabled={saving}
              >
                Zrušiť
              </Button>
              <Button
                onClick={handleSaveConfiguration}
                variant="contained"
                disabled={!configurationName.trim() || saving}
                startIcon={saving ? undefined : <SaveIcon />}
              >
                {saving ? 'Ukladám...' : 'Uložiť'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default OrderSuccessPage