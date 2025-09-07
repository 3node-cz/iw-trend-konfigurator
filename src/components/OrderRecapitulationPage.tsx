import React, { useState } from 'react'
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
import { AvailabilityChip, CuttingLayoutDiagram } from './common'
import { GuillotineCuttingOptimizer } from '../utils/guillotineCutting'

interface OrderRecapitulationPageProps {
  order: OrderFormData
  specifications: CuttingSpecification[]
  onBack?: () => void
  onSubmitOrder?: (completeOrder: CompleteOrder) => void
}

const OrderRecapitulationPage: React.FC<OrderRecapitulationPageProps> = ({
  order,
  specifications,
  onBack,
  onSubmitOrder
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Generate cutting layouts for all materials
  const generateCuttingLayouts = () => {
    return specifications.map((specification, index) => {
      // Debug: Log material data
      console.log(`Material ${index + 1}:`, specification.material)
      console.log(`Pieces:`, specification.pieces)
      
      if (specification.pieces.length === 0) {
        console.log(`No pieces for material ${index + 1}`)
        return null
      }

      // Use default dimensions if not provided (standard DTD board size)
      const dimensions = specification.material.dimensions || {
        width: 2800,   // Standard DTD board width
        height: 2070,  // Standard DTD board height
        thickness: 18  // Standard thickness
      }

      console.log(`Using dimensions for material ${index + 1}:`, dimensions)

      const optimizer = new GuillotineCuttingOptimizer(
        dimensions.width,
        dimensions.height
      )
      
      const layout = optimizer.optimize(specification.pieces)
      console.log(`Layout result for material ${index + 1}:`, layout)
      
      return {
        materialIndex: index + 1,
        materialName: specification.material.name,
        layout
      }
    }).filter(Boolean)
  }

  const cuttingLayouts = generateCuttingLayouts()
  
  // Debug: Log final layouts
  console.log('Generated cutting layouts:', cuttingLayouts)

  const handleSubmitOrder = async () => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call to Shopify
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const completeOrder: CompleteOrder = {
        order,
        specification: specifications,
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


  const totalPieces = specifications.reduce((total, spec) => 
    total + spec.pieces.reduce((sum, piece) => sum + piece.quantity, 0), 0
  )

  // Calculate overall efficiency and waste
  const overallStats = cuttingLayouts.reduce(
    (acc, layoutData) => {
      if (layoutData) {
        acc.totalBoards += 1
        acc.averageEfficiency += layoutData.layout.efficiency
        acc.totalWasteArea += layoutData.layout.totalWasteArea
      }
      return acc
    },
    { totalBoards: 0, averageEfficiency: 0, totalWasteArea: 0 }
  )

  if (overallStats.totalBoards > 0) {
    overallStats.averageEfficiency /= overallStats.totalBoards
  }

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

        {/* Materials Summary */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Materiály ({specifications.length})
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {specifications.map((specification, index) => (
                <Box key={specification.material.id} sx={{ 
                  p: 2, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 1,
                  backgroundColor: '#fafafa'
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Materiál {index + 1}
                  </Typography>
                  
                  <Box>
                    <Typography variant="caption" color="text.secondary">Materiál</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{specification.material.name}</Typography>
                    <Typography variant="caption" color="primary">{specification.material.productCode}</Typography>
                  </Box>
                  
                  {specification.material.dimensions && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">Rozmery: </Typography>
                      <Typography variant="caption">
                        {specification.material.dimensions.width} × {specification.material.dimensions.height} × {specification.material.dimensions.thickness} mm
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AvailabilityChip
                      availability={specification.material.availability}
                      size="small"
                    />
                  </Box>
                  
                  {specification.edgeMaterial && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">Hrana: </Typography>
                      <Typography variant="caption">{specification.edgeMaterial.name} ({specification.edgeMaterial.thickness}mm)</Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">Lepidlo: </Typography>
                    <Typography variant="caption">{specification.glueType}</Typography>
                  </Box>
                  
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">Kusov: </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {specification.pieces.reduce((sum, piece) => sum + piece.quantity, 0)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Cutting Pieces Summary */}
      {specifications.map((specification, specIndex) => (
        <Paper key={specification.material.id} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Kusy na rezanie - Materiál {specIndex + 1} ({specification.pieces.length} položiek, {specification.pieces.reduce((sum, piece) => sum + piece.quantity, 0)} kusov)
          </Typography>
          
          <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {specification.material.name}
            </Typography>
            <Typography variant="body2" color="primary">
              {specification.material.productCode}
            </Typography>
          </Box>
          
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
      ))}

      {/* Cutting Layout Diagrams */}
      {cuttingLayouts.length > 0 ? (
        cuttingLayouts.map((layoutData) => (
          <CuttingLayoutDiagram
            key={`layout-${layoutData!.materialIndex}`}
            layout={layoutData!.layout}
            title={`Plán č. ${layoutData!.materialIndex} - ${layoutData!.materialName}`}
            maxWidth={1200}
            maxHeight={800}
          />
        ))
      ) : (
        <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'warning.main' }}>
            Rozrezové plány
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rozrezové plány sa zobrazia po pridaní kusov na rezanie s rozmermi.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Debug: {cuttingLayouts.length} layouts generated from {specifications.length} materials
          </Typography>
        </Paper>
      )}

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
        </Box>
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