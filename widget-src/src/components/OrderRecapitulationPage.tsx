import React, { useState, useEffect } from 'react'
import { calculateTotalPieces } from '../utils/data-transformation'
import { formatPriceNumber } from '../utils/formatting'
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
  CircularProgress,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'
import Grid from '@mui/system/Grid'
import type {
  OrderFormData,
  CuttingSpecification,
  CompleteOrder,
} from '../types/shopify'
import type { CuttingLayout } from '../utils/guillotineCutting'
import {
  AvailabilityChip,
  CuttingDiagramThumbnail,
  CuttingDiagramDialog,
  OrderCalculationsSummary,
} from './common'
import OrderInvoiceTable from './OrderInvoiceTable'
import { useCuttingLayouts, useOrderCalculations } from '../hooks'
import { useOrderSubmission } from '../hooks/useOrderSubmission'
import {
  groupCuttingLayouts,
  getGroupedLayoutTitle,
  getGroupedLayoutShortTitle,
  getGroupedLayoutDescription
} from '../utils/layoutGrouping'

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
  onOrderSuccess,
}) => {
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [selectedDiagram, setSelectedDiagram] = useState<{
    layout: CuttingLayout
    title: string
    globalPieceTypes?: string[]
  } | null>(null)

  // Use custom hooks for cutting layouts and order calculations
  const { cuttingLayouts, overallStats } = useCuttingLayouts(specifications)
  const orderCalculations = useOrderCalculations(specifications, cuttingLayouts)

  // Use order submission hook
  const {
    isSubmitting,
    error: submissionError,
    success: submissionSuccess,
    checkoutUrl,
    submitOrder,
    clearError,
    resetSuccess,
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
        submittedAt: new Date(),
      }

      // Submit to Shopify cart
      await submitOrder(completeOrder)
    } catch (error) {
      console.error('Order submission failed:', error)
      // Error is handled by the useOrderSubmission hook
    }
  }

  const totalPieces = calculateTotalPieces(specifications)

  // Calculate discounted cutting cost
  const rawCuttingCost = orderCalculations.totals.totalCuttingCost
  const discountedCuttingCost = order.discountPercentage > 0
    ? rawCuttingCost * (1 - order.discountPercentage / 100)
    : rawCuttingCost

  // Check for unavailable products
  const unavailableProducts = specifications.reduce((acc, spec) => {
    if (!spec.material.variant?.availableForSale) {
      acc.push(`${spec.material.title} (materiál)`)
    }
    if (spec.edgeMaterial && spec.edgeMaterial.availability === 'unavailable') {
      acc.push(`${spec.edgeMaterial.name} (hrana)`)
    }
    return acc
  }, [] as string[])

  if (submitSuccess) {
    return (
      <Container
        maxWidth="md"
        sx={{ py: 8, textAlign: 'center' }}
      >
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography
          variant="h4"
          sx={{ color: 'success.main', mb: 2 }}
        >
          Zákazka bola úspešne odoslaná!
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Vaša zákazka "{order.orderName}" bola odoslaná do systému Shopify a
          bude spracovaná.
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
    <Container
      maxWidth={false}
      sx={{ maxWidth: '1920px', mx: 'auto', py: 3 }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          disabled={isSubmitting}
        >
          Späť
        </Button>
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: 'primary.main', fontWeight: 500 }}
        >
          {order.orderName} - Rekapitulácia zákazky
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
      >
        {/* Order Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 1.5, fontWeight: 600 }}
            >
              Informácie o zákazke
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Zákazník
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500 }}
                >
                  {order.company}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Prevádzková jednotka
                </Typography>
                <Typography variant="body2">
                  {order.transferLocation}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Nárezové centrum
                </Typography>
                <Typography variant="body2">{order.cuttingCenter}</Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Požadovaný dátum dodania
                </Typography>
                <Typography variant="body2">
                  {order.deliveryDate
                    ? order.deliveryDate.toLocaleDateString('sk-SK')
                    : 'Neurčené'}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Spôsob dopravy
                </Typography>
                <Typography variant="body2">{order.deliveryMethod}</Typography>
              </Box>

              {order.notes && (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Poznámka
                  </Typography>
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
        order={order}
      />

      {/* Cutting Layout Diagrams - Grouped Thumbnail View */}
      {cuttingLayouts.length > 0 ? (
        <Paper sx={{ p: 3, mt: 3, mb: 3 }}>
          {(() => {
            // Group identical cutting layouts
            const groupedLayouts = groupCuttingLayouts(cuttingLayouts)
            const totalDiagrams = cuttingLayouts.length
            const uniqueDiagrams = groupedLayouts.length

            // Calculate global piece types for consistent coloring across all diagrams
            const globalPieceTypes = [
              ...new Set(
                specifications.flatMap((spec) =>
                  spec.pieces.map((piece) => piece.partName || piece.id),
                ),
              ),
            ]

            return (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600 }}
                  >
                    Rozrezové plány
                  </Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                      {uniqueDiagrams} unikátnych plánov
                    </Typography>
                    {totalDiagrams !== uniqueDiagrams && (
                      <Typography variant="caption" color="text.secondary">
                        z celkovo {totalDiagrams} dosiek
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {totalDiagrams !== uniqueDiagrams
                    ? 'Identické plány sú zoskupené s počítadlom. Kliknite na diagram pre detail.'
                    : 'Kliknite na diagram pre zobrazenie detailu'
                  }
                </Typography>

                {/* Grouped Thumbnail Grid */}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    justifyContent: 'flex-start',
                  }}
                >
                  {groupedLayouts.map((groupData) => {
                    const shortTitle = getGroupedLayoutShortTitle(groupData)
                    const fullTitle = getGroupedLayoutTitle(groupData)
                    const description = getGroupedLayoutDescription(groupData)

                    return (
                      <CuttingDiagramThumbnail
                        key={`group-${groupData.groupId}`}
                        layout={groupData.layout}
                        title={shortTitle}
                        globalPieceTypes={globalPieceTypes}
                        count={groupData.count}
                        description={description}
                        onClick={() =>
                          setSelectedDiagram({
                            layout: groupData.layout,
                            title: fullTitle,
                            globalPieceTypes,
                          })
                        }
                      />
                    )
                  })}
                </Box>
              </>
            )
          })()}

        </Paper>
      ) : (
        <Paper sx={{ p: 3, mt: 3, mb: 3, textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: 'warning.main' }}
          >
            Rozrezové plány
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Rozrezové plány sa zobrazia po pridaní kusov na rezanie s rozmermi.
          </Typography>
        </Paper>
      )}

      {/* Cutting Diagram Dialog */}
      <CuttingDiagramDialog
        open={!!selectedDiagram}
        layout={selectedDiagram?.layout || null}
        title={selectedDiagram?.title || ''}
        globalPieceTypes={selectedDiagram?.globalPieceTypes}
        onClose={() => setSelectedDiagram(null)}
      />

      {/* Total Summary */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f0f7ff' }}>
        <Typography
          variant="h6"
          sx={{ mb: 1, fontWeight: 600 }}
        >
          Celková rekapitulácia
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Materiály
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600 }}
            >
              {specifications.length}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Celkový počet kusov
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600 }}
            >
              {totalPieces}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Potrebné dosky
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600 }}
            >
              {overallStats.totalBoards}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Priemerná efektivita
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: 'success.main' }}
            >
              {overallStats.averageEfficiency.toFixed(1)}%
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Celkový odpad
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: 'warning.main' }}
            >
              {formatPriceNumber(overallStats.totalWasteArea / 1000000)} m²
            </Typography>
          </Box>
          {overallStats.totalUnplacedPieces > 0 && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Neumiestnené kusy
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: 'error.main' }}
              >
                {overallStats.totalUnplacedPieces}
              </Typography>
            </Box>
          )}
          {orderCalculations.totals.totalEdgeLength > 0 && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Hranový materiál
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: 'info.main' }}
              >
                {formatPriceNumber(orderCalculations.totals.totalEdgeLength)} m
              </Typography>
            </Box>
          )}
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Náklady na rezanie
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: 'secondary.main' }}
            >
              {formatPriceNumber(discountedCuttingCost)} €
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Error Display */}
      {submissionError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={clearError}
        >
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
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 0.5 }}
          >
            ✅ Zákazka bola úspešne pridaná do košíka!
          </Typography>
          <Typography variant="body2">
            Váš košík je pripravený v Shopify systéme. Kliknite na tlačidlo pre
            dokončenie objednávky.
          </Typography>
        </Alert>
      )}

      {/* Unavailable Products Warning */}
      {unavailableProducts.length > 0 && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 1 }}
          >
            ⚠️ Pozor: Niektoré produkty nie sú momentálne skladom
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 1 }}
          >
            Tieto produkty budú dodané na objednávku:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {unavailableProducts.map((product, index) => (
              <li key={index}>
                <Typography variant="body2">{product}</Typography>
              </li>
            ))}
          </ul>
          <Typography
            variant="body2"
            sx={{ mt: 1, fontStyle: 'italic' }}
          >
            Dodacia lehota bude predĺžená podľa dostupnosti materiálov.
          </Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      <Paper
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Alert
          severity="info"
          sx={{ flex: 1, mr: 3 }}
        >
          Skontrolujte všetky údaje pred odoslaním zákazky do systému Shopify.
        </Alert>

        <Button
          variant="contained"
          size="large"
          startIcon={
            isSubmitting ? (
              <CircularProgress
                size={20}
                color="inherit"
              />
            ) : (
              <SendIcon />
            )
          }
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          sx={{
            minWidth: 200,
            bgcolor: isSubmitting ? 'grey.400' : 'success.main',
            '&:hover': {
              bgcolor: isSubmitting ? 'grey.400' : 'success.dark',
            },
          }}
        >
          {isSubmitting ? 'Odosielam...' : 'Odoslať zákazku'}
        </Button>
      </Paper>
    </Container>
  )
}

export default OrderRecapitulationPage
