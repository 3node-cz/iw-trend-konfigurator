import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
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
import type { OrderFormData, CuttingSpecification, CompleteOrder } from '../types/shopify'
import { AvailabilityChip, CuttingDiagramThumbnail, CuttingDiagramDialog, OrderCalculationsSummary } from './common'
import OrderInvoiceTable from './OrderInvoiceTable'
import { useCuttingLayouts, useOrderCalculations } from '../hooks'
import { useOrderSubmission } from '../hooks/useOrderSubmission'

interface OrderRecapitulationPageProps {
  order: OrderFormData
  specifications: CuttingSpecification[]
  onBack?: () => void
  onSubmitOrder?: (completeOrder: CompleteOrder) => void
  onOrderSuccess?: (checkoutUrl: string, orderName: string) => void
}

const OrderRecapitulationPage: React.FC<OrderRecapitulationPageProps> = ({
  order,
  specifications,
  onBack,
  onSubmitOrder,
  onOrderSuccess
}) => {
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [selectedDiagram, setSelectedDiagram] = useState<{layout: any, title: string} | null>(null)

  // Use custom hooks for cutting layouts and order calculations
  const { cuttingLayouts, overallStats } = useCuttingLayouts(specifications)
  const orderCalculations = useOrderCalculations(specifications)
  
  // Use order submission hook
  const { 
    isSubmitting, 
    error: submissionError, 
    success: submissionSuccess,
    checkoutUrl,
    submitOrder, 
    clearError,
    resetSuccess 
  } = useOrderSubmission()

  // Watch for successful submission and redirect to success page
  useEffect(() => {
    if (submissionSuccess && checkoutUrl && onOrderSuccess) {
      onOrderSuccess(checkoutUrl, order.orderName)
    }
  }, [submissionSuccess, checkoutUrl, onOrderSuccess, order.orderName])

  const handleSubmitOrder = async () => {
    // Clear any previous errors
    if (submissionError) {
      clearError()
    }
    
    try {
      const completeOrder: CompleteOrder = {
        order,
        specifications,
        cuttingLayouts,
        orderCalculations,
        submittedAt: new Date()
      }
      
      // Submit to Shopify cart 
      await submitOrder(completeOrder)
      
    } catch (error) {
      console.error('Order submission failed:', error)
      // Error is handled by the useOrderSubmission hook
    }
  }


  const totalPieces = specifications.reduce((total, spec) => 
    total + spec.pieces.reduce((sum, piece) => sum + piece.quantity, 0), 0
  )


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
    <Container maxWidth={false} sx={{ maxWidth: '1920px', mx: 'auto', py: 3 }}>
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
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
              Informácie o zákazke
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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

      </Grid>

      {/* Order Invoice Table */}
      <OrderInvoiceTable 
        specifications={specifications}
        cuttingLayouts={cuttingLayouts}
        orderCalculations={orderCalculations}
      />

      {/* Cutting Layout Diagrams - Thumbnail View */}
      {cuttingLayouts.length > 0 ? (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Rozrezové plány ({cuttingLayouts.length})
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Kliknite na diagram pre zobrazenie detailu
          </Typography>
          
          {/* Thumbnail Grid */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2,
            justifyContent: 'flex-start'
          }}>
            {cuttingLayouts.map((layoutData) => {
              const title = layoutData.isMultiBoard 
                ? `Plán ${layoutData.materialIndex}.${layoutData.boardNumber}`
                : `Plán ${layoutData.materialIndex}`
              
              const fullTitle = layoutData.isMultiBoard 
                ? `Plán č. ${layoutData.materialIndex}.${layoutData.boardNumber} - ${layoutData.materialName} (${layoutData.boardNumber}/${layoutData.totalBoards})`
                : `Plán č. ${layoutData.materialIndex} - ${layoutData.materialName}`
                
              return (
                <CuttingDiagramThumbnail
                  key={`layout-${layoutData.materialIndex}-${layoutData.boardNumber}`}
                  layout={layoutData.layout}
                  title={title}
                  onClick={() => setSelectedDiagram({ layout: layoutData.layout, title: fullTitle })}
                />
              )
            })}
          </Box>

          {/* Multi-board Statistics */}
          {cuttingLayouts.some(l => l.isMultiBoard) && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Štatistiky materiálov vyžadujúcich viacero dosiek
              </Typography>
              {cuttingLayouts.filter(l => l.isMultiBoard && l.boardNumber === 1).map(layoutData => (
                <Paper key={`stats-${layoutData.materialIndex}`} sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    {layoutData.materialName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Potrebné dosky</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {layoutData.totalBoards}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Celkom kusov</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {layoutData.multiboardStats.totalPieces}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Umiestnené kusy</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {layoutData.multiboardStats.totalPlacedPieces}
                      </Typography>
                    </Box>
                    {layoutData.multiboardStats.totalUnplacedPieces > 0 && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">Neumiestnené kusy</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main' }}>
                          {layoutData.multiboardStats.totalUnplacedPieces}
                        </Typography>
                      </Box>
                    )}
                    <Box>
                      <Typography variant="caption" color="text.secondary">Celková efektivita</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {layoutData.multiboardStats.overallEfficiency.toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Paper>
      ) : (
        <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'warning.main' }}>
            Rozrezové plány
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rozrezové plány sa zobrazia po pridaní kusov na rezanie s rozmermi.
          </Typography>
        </Paper>
      )}

      {/* Cutting Diagram Dialog */}
      <CuttingDiagramDialog
        open={!!selectedDiagram}
        layout={selectedDiagram?.layout || null}
        title={selectedDiagram?.title || ''}
        onClose={() => setSelectedDiagram(null)}
      />

      {/* Total Summary */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f0f7ff' }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Celková rekapitulácia
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Materiály</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {specifications.length}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Celkový počet kusov</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {totalPieces}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Potrebné dosky</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {overallStats.totalBoards}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Priemerná efektivita</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
              {overallStats.averageEfficiency.toFixed(1)}%
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Celkový odpad</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
              {(overallStats.totalWasteArea / 1000000).toFixed(2)} m²
            </Typography>
          </Box>
          {overallStats.totalUnplacedPieces > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary">Neumiestnené kusy</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                {overallStats.totalUnplacedPieces}
              </Typography>
            </Box>
          )}
          {orderCalculations.totals.totalEdgeLength > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary">Hranový materiál</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'info.main' }}>
                {orderCalculations.totals.totalEdgeLength.toFixed(2)} m
              </Typography>
            </Box>
          )}
          <Box>
            <Typography variant="caption" color="text.secondary">Náklady na rezanie</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.main' }}>
              {orderCalculations.totals.totalCuttingCost.toFixed(2)} €
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Error Display */}
      {submissionError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {submissionError}
        </Alert>
      )}

      {/* Success Display */}
      {submissionSuccess && checkoutUrl && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }} 
          onClose={resetSuccess}
          action={
            <Button 
              color="inherit" 
              size="small" 
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textTransform: 'none' }}
            >
              Otvoriť košík →
            </Button>
          }
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            ✅ Zákazka bola úspešne pridaná do košíka!
          </Typography>
          <Typography variant="body2">
            Váš košík je pripravený v Shopify systéme. Kliknite na tlačidlo pre dokončenie objednávky.
          </Typography>
        </Alert>
      )}

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