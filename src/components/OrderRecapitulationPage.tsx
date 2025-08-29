import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'
import Grid from '@mui/system/Grid'
import type { OrderFormData, CuttingSpecification } from '../types/shopify'

interface OrderRecapitulationPageProps {
  order: OrderFormData
  specification: CuttingSpecification
  onBack?: () => void
  onSubmitOrder?: (completeOrder: CompleteOrder) => void
}

interface CompleteOrder {
  order: OrderFormData
  specification: CuttingSpecification
  submittedAt: Date
}

const OrderRecapitulationPage: React.FC<OrderRecapitulationPageProps> = ({
  order,
  specification,
  onBack,
  onSubmitOrder
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmitOrder = async () => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call to Shopify
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const completeOrder: CompleteOrder = {
        order,
        specification,
        submittedAt: new Date()
      }
      
      console.log('Submitting complete order to Shopify:', completeOrder)
      
      // TODO: Replace with actual Shopify API call
      // await submitOrderToShopify(completeOrder)
      
      setSubmitSuccess(true)
      setTimeout(() => {
        onSubmitOrder?.(completeOrder)
      }, 1500)
      
    } catch (error) {
      console.error('Order submission failed:', error)
      // TODO: Handle submission error
    } finally {
      setIsSubmitting(false)
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'success'
      case 'unavailable': return 'error'
      case 'limited': return 'warning'
      default: return 'default'
    }
  }

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Skladom'
      case 'unavailable': return 'Na objednávku'
      case 'limited': return 'Obmedzene'
      default: return availability
    }
  }

  const totalPieces = specification.pieces.reduce((sum, piece) => sum + piece.quantity, 0)

  if (submitSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" sx={{ color: 'success.main', mb: 2 }}>
          Zákazka bola úspešne odoslaná!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Vaša zákazka "{order.orderName}" bola odoslaná do systému Shopify a bude spracovaná.
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
        >
          Vytvoriť novú zákazku
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          disabled={isSubmitting}
        >
          Späť
        </Button>
        <Typography variant="h4" component="h1" sx={{ color: '#1976d2', fontWeight: 500 }}>
          {order.orderName} - Rekapitulácia zákazky
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Order Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Informácie o zákazke
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Zákazník</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{order.company}</Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">Prevádzková jednotka</Typography>
                <Typography variant="body2">{order.transferLocation}</Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">Nárezové centrum</Typography>
                <Typography variant="body2">{order.cuttingCenter}</Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">Požadovaný dátum dodania</Typography>
                <Typography variant="body2">
                  {order.deliveryDate ? order.deliveryDate.toLocaleDateString('sk-SK') : 'Neurčené'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">Spôsob dopravy</Typography>
                <Typography variant="body2">{order.deliveryMethod}</Typography>
              </Box>
              
              {order.notes && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Poznámka</Typography>
                  <Typography variant="body2">{order.notes}</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Material Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Materiál a hrana
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Materiál</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{specification.material.name}</Typography>
                <Typography variant="body2" color="primary">{specification.material.productCode}</Typography>
              </Box>
              
              {specification.material.dimensions && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Rozmery</Typography>
                  <Typography variant="body2">
                    {specification.material.dimensions.width} × {specification.material.dimensions.height} × {specification.material.dimensions.thickness} mm
                  </Typography>
                </Box>
              )}
              
              <Box>
                <Typography variant="caption" color="text.secondary">Dostupnosť</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={getAvailabilityText(specification.material.availability)}
                    size="small"
                    color={getAvailabilityColor(specification.material.availability)}
                    variant="outlined"
                  />
                </Box>
              </Box>
              
              {specification.edgeMaterial && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Hrana</Typography>
                  <Typography variant="body2">{specification.edgeMaterial.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hrúbka: {specification.edgeMaterial.thickness}mm
                  </Typography>
                </Box>
              )}
              
              <Box>
                <Typography variant="caption" color="text.secondary">Typ lepidla</Typography>
                <Typography variant="body2">{specification.glueType}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Cutting Pieces Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Kusy na rezanie ({specification.pieces.length} položiek, {totalPieces} kusov celkom)
        </Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Názov dielca</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rozmery (D×Š)</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Počet</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Letokruhy</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Bez orezu</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Dupel</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Hrany</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Poznámka</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {specification.pieces.map((piece, index) => (
                <TableRow key={piece.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {piece.partName || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {piece.length} × {piece.width} mm
                    </Typography>
                  </TableCell>
                  <TableCell>{piece.quantity}</TableCell>
                  <TableCell>{piece.glueEdge ? '✓' : '—'}</TableCell>
                  <TableCell>{piece.withoutEdge ? '✓' : '—'}</TableCell>
                  <TableCell>{piece.duplicate ? '✓' : '—'}</TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {piece.edgeAllAround ? (
                        `Dookola: ${piece.edgeAllAround}`
                      ) : (
                        [
                          piece.edgeTop && `V: ${piece.edgeTop}`,
                          piece.edgeBottom && `S: ${piece.edgeBottom}`,
                          piece.edgeLeft && `Ľ: ${piece.edgeLeft}`,
                          piece.edgeRight && `P: ${piece.edgeRight}`
                        ].filter(Boolean).join(', ') || '—'
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{piece.notes || '—'}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Buttons */}
      <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Alert severity="info" sx={{ flex: 1, mr: 3 }}>
          Skontrolujte všetky údaje pred odoslaním zákazky do systému Shopify.
        </Alert>
        
        <Button
          variant="contained"
          size="large"
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          sx={{ 
            minWidth: 200,
            bgcolor: isSubmitting ? 'grey.400' : 'success.main',
            '&:hover': {
              bgcolor: isSubmitting ? 'grey.400' : 'success.dark'
            }
          }}
        >
          {isSubmitting ? 'Odosielam...' : 'Odoslať zákazku'}
        </Button>
      </Paper>
    </Container>
  )
}

export default OrderRecapitulationPage