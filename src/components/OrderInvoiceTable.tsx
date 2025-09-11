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
  Box
} from '@mui/material'
import type { CuttingSpecification, OrderCalculations } from '../types/shopify'

interface OrderItem {
  id: string
  name: string
  code: string
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  type: 'material' | 'edge' | 'cutting' | 'service'
}

interface OrderInvoiceTableProps {
  specifications: CuttingSpecification[]
  cuttingLayouts: any[]
  orderCalculations: OrderCalculations
}

const OrderInvoiceTable: React.FC<OrderInvoiceTableProps> = ({
  specifications,
  cuttingLayouts,
  orderCalculations
}) => {
  // Generate order items from specifications and calculations
  const orderItems: OrderItem[] = []
  let itemCounter = 1

  // Add material boards
  specifications.forEach((spec, specIndex) => {
    const boardsNeeded = cuttingLayouts.filter(layout => layout.materialIndex === specIndex + 1).length || 1
    
    orderItems.push({
      id: `material-${specIndex}`,
      name: spec.material.name,
      code: spec.material.productCode || spec.material.code || '',
      quantity: boardsNeeded,
      unit: 'ks',
      unitPrice: spec.material.price?.amount || 0,
      totalPrice: (spec.material.price?.amount || 0) * boardsNeeded,
      type: 'material'
    })

    // Add edge material if present
    if (spec.edgeMaterial) {
      const totalEdgeLength = spec.pieces.reduce((sum, piece) => {
        let pieceEdgeLength = 0
        if (piece.edgeAllAround) {
          pieceEdgeLength = ((piece.length + piece.width) * 2) * piece.quantity / 1000 // Convert to meters
        } else {
          const edges = [piece.edgeTop, piece.edgeBottom, piece.edgeLeft, piece.edgeRight]
          edges.forEach(edge => {
            if (edge) {
              // Simplified edge length calculation
              pieceEdgeLength += (piece.length + piece.width) / 2 * piece.quantity / 1000
            }
          })
        }
        return sum + pieceEdgeLength
      }, 0)

      if (totalEdgeLength > 0) {
        orderItems.push({
          id: `edge-${specIndex}`,
          name: `${spec.edgeMaterial.name}`,
          code: spec.edgeMaterial.code || '',
          quantity: Math.ceil(totalEdgeLength),
          unit: 'm',
          unitPrice: spec.edgeMaterial.price?.amount || 0,
          totalPrice: Math.ceil(totalEdgeLength) * (spec.edgeMaterial.price?.amount || 0),
          type: 'edge'
        })
      }
    }
  })

  // Add cutting services
  const totalCuttingCost = orderCalculations.totals?.totalCuttingCost || 0
  if (totalCuttingCost > 0) {
    const totalPieces = specifications.reduce((sum, spec) => 
      sum + spec.pieces.reduce((pieceSum, piece) => pieceSum + piece.quantity, 0), 0
    )
    
    orderItems.push({
      id: 'cutting-service',
      name: 'Rezanie materiálov',
      code: 'CUTTING',
      quantity: totalPieces,
      unit: 'rezov',
      unitPrice: totalCuttingCost / totalPieces,
      totalPrice: totalCuttingCost,
      type: 'cutting'
    })
  }

  const grandTotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0)

  return (
    <Paper sx={{ mt: 3 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Položky objednávky
        </Typography>
      </Box>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>Názov</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Kód</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Množstvo</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cena za jednotku</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Celková cena</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderItems.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '2px',
                        backgroundColor: 
                          item.type === 'material' ? '#1976d2' :
                          item.type === 'edge' ? '#ff9800' :
                          item.type === 'cutting' ? '#4caf50' :
                          '#9c27b0'
                      }}
                    />
                    <Typography variant="body2">
                      {item.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
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
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.totalPrice.toFixed(2)} €
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            
            {/* Total row */}
            <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
              <TableCell colSpan={4}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Celkom
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
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