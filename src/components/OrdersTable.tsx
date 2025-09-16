import React from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Typography
} from '@mui/material'
import {
  PlayArrow as PlayArrowIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { dummySavedOrders } from '../data/dummyOrders'
import type { SavedOrder } from '../types/savedOrder'

interface OrdersTableProps {
  onLoadConfiguration?: (order: SavedOrder) => void // Loads config and goes to order summary
  onDeleteOrder?: (order: SavedOrder) => void
}

const getStateColor = (status: SavedOrder['status']) => {
  switch (status) {
    case 'draft':
      return 'default'
    case 'saved':
      return 'warning'
    case 'submitted':
      return 'info'
    case 'processing':
      return 'primary'
    case 'completed':
      return 'success'
    case 'cancelled':
      return 'error'
    default:
      return 'default'
  }
}

const getStateLabel = (status: SavedOrder['status']) => {
  switch (status) {
    case 'draft':
      return 'Návrh'
    case 'saved':
      return 'Uložená'
    case 'submitted':
      return 'Odoslaná'
    case 'processing':
      return 'Rozrezávaná'
    case 'completed':
      return 'Hotová'
    case 'cancelled':
      return 'Zrušená'
    default:
      return status
  }
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('sk-SK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const OrdersTable: React.FC<OrdersTableProps> = ({ 
  onLoadConfiguration, 
  onDeleteOrder 
}) => {
  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>Číslo zákazky</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Názov zákazky</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Dátum vytvorenia</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Kusov</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Pobočka</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Akcie</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummySavedOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                    {order.orderNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {order.orderInfo.orderName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(order.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {order.summary.totalPieces}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {order.orderInfo.costCenter}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => onLoadConfiguration?.(order)}
                      title="Načítať a pokračovať"
                    >
                      <PlayArrowIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => onDeleteOrder?.(order)}
                      title="Zmazať"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Table Footer with Pagination Info */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="body2" color="text.secondary">
          Zobrazuje sa 1 až {dummySavedOrders.length} z {dummySavedOrders.length} záznamov
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Stránka 1 z 1
        </Typography>
      </Box>
    </Paper>
  )
}

export default OrdersTable