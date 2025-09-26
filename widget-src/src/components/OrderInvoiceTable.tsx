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
import { formatPriceNumber } from '../utils/formatting'

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

// Static style objects to prevent recreation on each render
const strikethroughStyle = { textDecoration: 'line-through', color: 'text.secondary' }
const successStyle = { fontWeight: 500, color: 'success.main' }
const rightAlignStyle = { textAlign: 'right' }
const blockStyle = { textDecoration: 'line-through', color: 'text.secondary', display: 'block' }

// Color palette for materials (same as cutting diagrams) - moved outside component
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

const OrderInvoiceTable: React.FC<OrderInvoiceTableProps> = ({
  specifications,
  cuttingLayouts,
  orderCalculations,
  order,
}) => {
  // Debug log - expanded
  console.log('OrderInvoiceTable - Full Order Object:', order)
  console.log('OrderInvoiceTable - Discount Check:', {
    discountPercentage: order.discountPercentage,
    discountType: typeof order.discountPercentage,
    discountExists: !!order.discountPercentage,
    discountGreaterThanZero: order.discountPercentage > 0,
    orderName: order.orderName
  })

  // Temporary: Force discount for debugging
  const effectiveDiscountPercentage = order.discountPercentage || 10 // Force 10% if no discount set

  // Helper function to apply customer discount
  const applyDiscount = (price: number): number => {
    if (effectiveDiscountPercentage > 0) {
      return price * (1 - effectiveDiscountPercentage / 100)
    }
    return price
  }

  // Generate order items from specifications and calculations
  const orderItems: OrderItem[] = []

  // Add material boards with their edges
  specifications.forEach((spec, specIndex) => {
    console.log(`🔍 Processing specification ${specIndex}:`, {
      material: spec.material.title,
      edgeMaterial: spec.edgeMaterial,
      pieces: spec.pieces.length
    })

    const materialLayouts = cuttingLayouts.filter(
      (layout) => layout.materialIndex === specIndex + 1,
    )
    const boardsNeeded = materialLayouts.length || 1

    const originalUnitPrice = parseFloat(spec.material.variant?.price || "0")
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
      console.log(`🔍 Found edge material for spec ${specIndex}:`, spec.edgeMaterial)

      const totalEdgeLength = spec.pieces.reduce((sum, piece) => {
        let pieceEdgeLength = 0

        // Use same calculation as edgeCalculations.ts
        if (piece.edgeTop) pieceEdgeLength += (piece.length * piece.quantity) / 1000
        if (piece.edgeBottom) pieceEdgeLength += (piece.length * piece.quantity) / 1000
        if (piece.edgeLeft) pieceEdgeLength += (piece.width * piece.quantity) / 1000
        if (piece.edgeRight) pieceEdgeLength += (piece.width * piece.quantity) / 1000

        console.log(`🔍 Piece edge calculation:`, {
          piece: piece.partName,
          edgeTop: piece.edgeTop,
          edgeBottom: piece.edgeBottom,
          edgeLeft: piece.edgeLeft,
          edgeRight: piece.edgeRight,
          pieceEdgeLength
        })

        return sum + pieceEdgeLength
      }, 0)

      console.log(`🔍 Total edge length for spec ${specIndex}:`, totalEdgeLength)

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
      effectiveDiscountPercentage > 0
        ? item.totalPrice / (1 - effectiveDiscountPercentage / 100)
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

        {effectiveDiscountPercentage > 0 && (
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
              ✓ Aplikovaná zľava zákazníka: {effectiveDiscountPercentage}% (úspora:{' '}
              {formatPriceNumber(totalDiscountAmount)} €)
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
              <TableCell sx={{ fontWeight: 600 }}>
                Cena za jednotku
                {effectiveDiscountPercentage > 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Pôvodná / Po zľave
                  </Typography>
                )}
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 600 }}
              >
                Celková cena
                {effectiveDiscountPercentage > 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Po zľave
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderItems.map((item) => {
              // Get the color for this material group
              const materialColor = item.materialIndex
                ? materialColors[(item.materialIndex - 1) % materialColors.length]
                : '#f5f5f5' // Default for cutting services

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
                              backgroundColor: materialColor,
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
                    {effectiveDiscountPercentage > 0 ? (
                      <Box>
                        <Typography variant="body2" sx={strikethroughStyle}>
                          {formatPriceNumber(item.unitPrice / (1 - effectiveDiscountPercentage / 100))} €
                        </Typography>
                        <Typography variant="body2" sx={successStyle}>
                          {formatPriceNumber(item.unitPrice)} €
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2">
                        {formatPriceNumber(item.unitPrice)} €
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {effectiveDiscountPercentage > 0 ? (
                      <Box sx={rightAlignStyle}>
                        <Typography variant="caption" sx={blockStyle}>
                          {formatPriceNumber(item.totalPrice / (1 - effectiveDiscountPercentage / 100))} €
                        </Typography>
                        <Typography variant="body2" sx={successStyle}>
                          {formatPriceNumber(item.totalPrice)} €
                        </Typography>
                      </Box>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500 }}
                      >
                        {formatPriceNumber(item.totalPrice)} €
                      </Typography>
                    )}
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
                  {effectiveDiscountPercentage > 0 && (
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 400 }}>
                      (Ušetrené: {formatPriceNumber(totalDiscountAmount)} € - {effectiveDiscountPercentage}% zľava)
                    </Typography>
                  )}
                </Typography>
              </TableCell>
              <TableCell align="right">
                {effectiveDiscountPercentage > 0 ? (
                  <Box sx={rightAlignStyle}>
                    <Typography variant="body2" sx={strikethroughStyle}>
                      {formatPriceNumber(totalWithoutDiscount)} €
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: 'primary.main' }}
                    >
                      {formatPriceNumber(grandTotal)} €
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: 'primary.main' }}
                  >
                    {formatPriceNumber(grandTotal)} €
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default OrderInvoiceTable
