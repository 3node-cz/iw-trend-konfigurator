import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material'
import type {
  CuttingSpecification,
  OrderCalculations,
  OrderFormData,
} from '../types/shopify'
import type { CuttingLayoutData } from '../hooks/useCuttingLayouts'

interface OrderItem {
  id: string
  name: string
  code: string
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  type: 'material' | 'edge' | 'cutting' | 'service'
  materialIndex?: number // For grouping and legend
  isEdgeForMaterial?: boolean // To identify edge items
  materialLayouts?: CuttingLayoutData[] // Store layouts for plan numbering
}

interface OrderInvoiceTableProps {
  specifications: CuttingSpecification[]
  cuttingLayouts: CuttingLayoutData[]
  orderCalculations: OrderCalculations
  order: OrderFormData // Add order data to access discount
}

const OrderInvoiceTable: React.FC<OrderInvoiceTableProps> = ({
  specifications,
  cuttingLayouts,
  orderCalculations,
  order,
}) => {
  // Helper function to apply customer discount
  const applyDiscount = (price: number): number => {
    if (order.discountPercentage > 0) {
      return price * (1 - order.discountPercentage / 100)
    }
    return price
  }

  // Color palette for materials (same as cutting diagrams)
  const materialColors = [
    '#E3F2FD', // Light blue
    '#F3E5F5', // Light purple
    '#E8F5E8', // Light green
    '#FFF3E0', // Light orange
    '#FCE4EC', // Light pink
    '#E0F2F1', // Light teal
    '#F1F8E9', // Light lime
    '#FFF8E1', // Light yellow
    '#E8EAF6', // Light indigo
    '#FFEBEE', // Light red
  ]

  // Generate order items from specifications and calculations
  const orderItems: OrderItem[] = []

  // Add material boards with their edges
  specifications.forEach((spec, specIndex) => {
    const materialLayouts = cuttingLayouts.filter(
      (layout) => layout.materialIndex === specIndex + 1,
    )
    const boardsNeeded = materialLayouts.length || 1

    const originalUnitPrice = spec.material.price?.amount || 0
    const discountedUnitPrice = applyDiscount(originalUnitPrice)

    // Add material board
    orderItems.push({
      id: `material-${specIndex}`,
      name: spec.material.title,
      code: spec.material.variant?.sku || spec.material.handle || '',
      quantity: boardsNeeded,
      unit: 'ks',
      unitPrice: discountedUnitPrice,
      totalPrice: discountedUnitPrice * boardsNeeded,
      type: 'material',
      materialIndex: specIndex + 1,
      materialLayouts: materialLayouts, // Store layouts for plan numbering
    })

    // Add edge material if present (grouped with the material)
    if (spec.edgeMaterial) {
      const totalEdgeLength = spec.pieces.reduce((sum, piece) => {
        let pieceEdgeLength = 0

        // Use same calculation as edgeCalculations.ts
        if (piece.edgeTop) pieceEdgeLength += (piece.length * piece.quantity) / 1000
        if (piece.edgeBottom) pieceEdgeLength += (piece.length * piece.quantity) / 1000
        if (piece.edgeLeft) pieceEdgeLength += (piece.width * piece.quantity) / 1000
        if (piece.edgeRight) pieceEdgeLength += (piece.width * piece.quantity) / 1000

        return sum + pieceEdgeLength
      }, 0)

      if (totalEdgeLength > 0) {
        const originalEdgeUnitPrice = spec.edgeMaterial.price?.amount || 0
        const discountedEdgeUnitPrice = applyDiscount(originalEdgeUnitPrice)

        orderItems.push({
          id: `edge-${specIndex}`,
          name: `${spec.edgeMaterial.name}`,
          code: spec.edgeMaterial.code || '',
          quantity: Math.ceil(totalEdgeLength),
          unit: 'm',
          unitPrice: discountedEdgeUnitPrice,
          totalPrice: Math.ceil(totalEdgeLength) * discountedEdgeUnitPrice,
          type: 'edge',
          materialIndex: specIndex + 1,
          isEdgeForMaterial: true,
        })
      }
    }
  })

  // Add cutting services
  const totalCuttingCost = orderCalculations.totals?.totalCuttingCost || 0
  if (totalCuttingCost > 0) {
    const totalPieces = specifications.reduce(
      (sum, spec) =>
        sum +
        spec.pieces.reduce((pieceSum, piece) => pieceSum + piece.quantity, 0),
      0,
    )
    const actualCuts = orderCalculations.totals?.totalCuts || totalPieces // Use actual cuts or fallback to pieces

    const discountedCuttingCost = applyDiscount(totalCuttingCost)

    orderItems.push({
      id: 'cutting-service',
      name: 'Rezanie materiálov',
      code: 'CUTTING',
      quantity: actualCuts,
      unit: 'rezov',
      unitPrice: discountedCuttingCost / actualCuts,
      totalPrice: discountedCuttingCost,
      type: 'cutting',
    })
  }

  const grandTotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0)
  const totalWithoutDiscount = orderItems.reduce((sum, item) => {
    // Calculate what the price would be without discount
    const originalPrice =
      order.discountPercentage > 0
        ? item.totalPrice / (1 - order.discountPercentage / 100)
        : item.totalPrice
    return sum + originalPrice
  }, 0)
  const totalDiscountAmount = totalWithoutDiscount - grandTotal

  return (
    <Paper sx={{ mt: 3 }}>
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 600 }}
        >
          Položky objednávky
        </Typography>

        {order.discountPercentage > 0 && (
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              backgroundColor: 'success.light',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: 'success.dark', fontWeight: 500 }}
            >
              ✓ Aplikovaná zľava zákazníka: {order.discountPercentage}% (úspora:{' '}
              {totalDiscountAmount.toFixed(2)} €)
            </Typography>
          </Box>
        )}
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>Názov</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Kód</TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 600 }}
              >
                Množstvo
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cena za jednotku</TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 600 }}
              >
                Celková cena
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderItems.map((item) => {
              // Get the color for this material group
              const getMaterialColor = () => {
                if (item.materialIndex) {
                  return materialColors[
                    (item.materialIndex - 1) % materialColors.length
                  ]
                }
                return '#f5f5f5' // Default for cutting services
              }

              const isEdgeItem = item.isEdgeForMaterial

              return (
                <TableRow
                  key={item.id}
                  hover
                  sx={{
                    backgroundColor: isEdgeItem
                      ? 'rgba(0,0,0,0.02)'
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: isEdgeItem
                        ? 'rgba(0,0,0,0.04)'
                        : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                    >
                      {/* Material Legend with Material Number (for both materials and edges) */}
                      {item.materialIndex && (
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '4px',
                              backgroundColor: getMaterialColor(),
                              border: '1px solid #ddd',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: '#333',
                            }}
                          >
                            {item.materialIndex}
                          </Box>
                        </Box>
                      )}

                      {/* Edge indentation for visual grouping - removed separator */}
                      {isEdgeItem && (
                        <Box sx={{ width: 20 }} /> // Just spacing, no separator line
                      )}

                      {/* Service items (cutting) without color indicator */}
                      {!item.materialIndex && (
                        <Box sx={{ width: 24 }} /> // Just spacing, no color indicator
                      )}

                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isEdgeItem ? 400 : 500,
                          color: isEdgeItem ? 'text.secondary' : 'text.primary',
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {item.code}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {item.quantity} {item.unit}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item.unitPrice.toFixed(2)} €
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500 }}
                    >
                      {item.totalPrice.toFixed(2)} €
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            })}

            {/* Total row */}
            <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
              <TableCell colSpan={4}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600 }}
                >
                  Celkom
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: 'primary.main' }}
                >
                  {grandTotal.toFixed(2)} €
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default OrderInvoiceTable
