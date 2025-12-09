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
  originalUnitPrice?: number // Original base price (before customer discount)
  hasCustomerDiscount?: boolean // Whether customer-specific pricing is applied
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

  // Note: All pricing (materials, edges) comes from the 3-tier customer pricing system
  // Cutting services do NOT get customer discounts

  // Generate order items from specifications and calculations
  const orderItems: OrderItem[] = []

  // Add material boards with their edges
  specifications.forEach((spec, specIndex) => {

    const materialLayouts = cuttingLayouts.filter(
      (layout) => layout.materialIndex === specIndex + 1,
    )
    const boardsNeeded = materialLayouts.length || 1

    // Material prices are already customer-specific from 3-tier pricing system
    // variant.price = customer price (already discounted)
    // variant._basePrice = original base price (for display only)
    // variant._customerDiscount = discount percentage applied
    const customerUnitPrice = parseFloat(spec.material.variant?.price || "0")
    const baseUnitPrice = parseFloat((spec.material.variant as any)?._basePrice || spec.material.variant?.price || "0")
    const customerDiscount = (spec.material.variant as any)?._customerDiscount || 0
    const pricingSource = (spec.material.variant as any)?._pricingSource || 'unknown'

    // 🧪 TESTING: Log material pricing in invoice
    console.log(`🧪 [INVOICE-MATERIAL] Material ${specIndex + 1}:`, {
      name: spec.material.title,
      sku: spec.material.variant?.sku,
      basePrice: `€${baseUnitPrice}`,
      customerPrice: `€${customerUnitPrice}`,
      discount: `${customerDiscount}%`,
      pricingSource,
      quantity: boardsNeeded,
      totalBase: `€${(baseUnitPrice * boardsNeeded).toFixed(2)}`,
      totalCustomer: `€${(customerUnitPrice * boardsNeeded).toFixed(2)}`,
      savings: customerDiscount > 0 ? `€${((baseUnitPrice - customerUnitPrice) * boardsNeeded).toFixed(2)}` : 'none'
    });

    // Add material board
    orderItems.push({
      id: `material-${specIndex}`,
      name: spec.material.title,
      code: spec.material.variant?.sku || spec.material.handle || '',
      quantity: boardsNeeded,
      unit: 'ks',
      unitPrice: customerUnitPrice,
      totalPrice: customerUnitPrice * boardsNeeded,
      type: 'material',
      materialIndex: specIndex + 1,
      materialLayouts: materialLayouts, // Store layouts for plan numbering
      // Store pricing metadata for display
      originalUnitPrice: baseUnitPrice,
      hasCustomerDiscount: customerDiscount > 0,
    })

  })

  // Add edge materials from edge consumption calculations
  // This handles multiple edge materials per specification (including custom edges)
  if (orderCalculations?.edgeConsumption) {
    orderCalculations.edgeConsumption.forEach((edgeConsumption, edgeIndex) => {
      if (edgeConsumption.totalEdgeLengthMeters > 0) {
        // Find the related specification to get edge material details
        const relatedSpecIndex = specifications.findIndex(
          s => (s.material?.title || s.material?.name) === edgeConsumption.materialName
        );
        const relatedSpec = relatedSpecIndex >= 0 ? specifications[relatedSpecIndex] : null;

        if (!relatedSpec) {
          console.warn(`Could not find specification for edge: ${edgeConsumption.edgeMaterialName}`);
          return;
        }

        // Find the edge material object (default or custom)
        let edgeMaterialObj = null;
        if (relatedSpec.edgeMaterial?.name === edgeConsumption.edgeMaterialName) {
          edgeMaterialObj = relatedSpec.edgeMaterial;
        } else {
          // Search in custom edges
          for (const piece of relatedSpec.pieces) {
            const customEdges = [
              piece.customEdgeTop,
              piece.customEdgeBottom,
              piece.customEdgeLeft,
              piece.customEdgeRight,
            ].filter(Boolean);

            for (const customEdge of customEdges) {
              if (customEdge?.name === edgeConsumption.edgeMaterialName) {
                edgeMaterialObj = customEdge;
                break;
              }
            }
            if (edgeMaterialObj) break;
          }
        }

        // Edge materials already have customer pricing applied from 3-tier system
        // price.amount = customer price (already discounted)
        // price._basePrice = original base price (for display only)
        // price._customerDiscount = discount percentage applied
        const customerEdgeUnitPrice = edgeMaterialObj?.price?.amount || 0;
        const baseEdgeUnitPrice = (edgeMaterialObj?.price as any)?._basePrice || customerEdgeUnitPrice;
        const edgeCustomerDiscount = (edgeMaterialObj?.price as any)?._customerDiscount || 0;
        const edgePricingSource = (edgeMaterialObj?.price as any)?._pricingSource || 'unknown';

        // Keep full precision - don't round to whole meters
        const edgeQuantity = edgeConsumption.totalEdgeLengthMeters;

        // 🧪 TESTING: Log edge pricing in invoice
        console.log(`🧪 [INVOICE-EDGE] Edge for Material ${relatedSpecIndex + 1}:`, {
          name: edgeConsumption.edgeMaterialName,
          code: edgeMaterialObj?.code,
          basePrice: `€${baseEdgeUnitPrice}/m`,
          customerPrice: `€${customerEdgeUnitPrice}/m`,
          discount: `${edgeCustomerDiscount}%`,
          pricingSource: edgePricingSource,
          quantity: `${edgeQuantity.toFixed(3)}m`,
          totalBase: `€${(baseEdgeUnitPrice * edgeQuantity).toFixed(2)}`,
          totalCustomer: `€${(customerEdgeUnitPrice * edgeQuantity).toFixed(2)}`,
          savings: edgeCustomerDiscount > 0 ? `€${((baseEdgeUnitPrice - customerEdgeUnitPrice) * edgeQuantity).toFixed(2)}` : 'none'
        });

        orderItems.push({
          id: `edge-${relatedSpecIndex}-${edgeIndex}`,
          name: edgeConsumption.edgeMaterialName,
          code: edgeMaterialObj?.code || '',
          quantity: edgeQuantity,
          unit: 'm',
          unitPrice: customerEdgeUnitPrice,
          totalPrice: edgeQuantity * customerEdgeUnitPrice,
          type: 'edge',
          materialIndex: relatedSpecIndex + 1,
          isEdgeForMaterial: true,
          // Store pricing metadata for display
          originalUnitPrice: baseEdgeUnitPrice,
          hasCustomerDiscount: edgeCustomerDiscount > 0,
        });
      }
    });
  }

  // Add cutting services (NO customer discount applied)
  const totalCuttingCost = orderCalculations.totals?.totalCuttingCost || 0
  if (totalCuttingCost > 0) {
    const totalPieces = specifications.reduce(
      (sum, spec) =>
        sum +
        spec.pieces.reduce((pieceSum, piece) => pieceSum + piece.quantity, 0),
      0,
    )
    const actualCuts = orderCalculations.totals?.totalCuts || totalPieces // Use actual cuts or fallback to pieces

    orderItems.push({
      id: 'cutting-service',
      name: 'Rezanie materiálov',
      code: 'CUTTING',
      quantity: actualCuts,
      unit: 'rezov',
      unitPrice: totalCuttingCost / actualCuts,
      totalPrice: totalCuttingCost,
      type: 'cutting',
      // Cutting services do not have customer discount
      hasCustomerDiscount: false,
    })
  }

  const grandTotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0)
  const totalWithoutDiscount = orderItems.reduce((sum, item) => {
    // Calculate original price based on whether item has customer discount
    const originalPrice = item.hasCustomerDiscount && item.originalUnitPrice
      ? item.originalUnitPrice * item.quantity
      : item.totalPrice
    return sum + originalPrice
  }, 0)
  const totalDiscountAmount = totalWithoutDiscount - grandTotal

  // Calculate effective discount percentage for display (based on actual savings)
  const effectiveDiscountPercent = totalWithoutDiscount > 0
    ? ((totalDiscountAmount / totalWithoutDiscount) * 100).toFixed(1)
    : '0'

  return (
    <Paper sx={{ mt: 3 }}>
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 600 }}
        >
          Položky objednávky
        </Typography>

        {totalDiscountAmount > 0 && (
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              backgroundColor: '#e8f5e9',
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
              ✓ Aplikovaná zákaznícka cena: {effectiveDiscountPercent}% zľava (úspora:{' '}
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
                {totalDiscountAmount > 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Pôvodná / Zákaznícka
                  </Typography>
                )}
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 600 }}
              >
                Celková cena
                {totalDiscountAmount > 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Zákaznícka cena
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
                      {item.type === 'edge' ? formatPriceNumber(item.quantity) : item.quantity} {item.unit}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {item.hasCustomerDiscount && item.originalUnitPrice ? (
                      <Box>
                        <Typography variant="body2" sx={strikethroughStyle}>
                          {formatPriceNumber(item.originalUnitPrice)} €
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
                    {item.hasCustomerDiscount && item.originalUnitPrice ? (
                      <Box sx={rightAlignStyle}>
                        <Typography variant="caption" sx={blockStyle}>
                          {formatPriceNumber(item.originalUnitPrice * item.quantity)} €
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
                  {totalDiscountAmount > 0 && (
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 400 }}>
                      (Ušetrené: {formatPriceNumber(totalDiscountAmount)} € - {effectiveDiscountPercent}% zľava)
                    </Typography>
                  )}
                </Typography>
              </TableCell>
              <TableCell align="right">
                {totalDiscountAmount > 0 ? (
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
