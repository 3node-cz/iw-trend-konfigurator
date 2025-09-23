import React, { useState, useEffect } from 'react'
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
  Typography,
  CircularProgress
} from '@mui/material'
import {
  PlayArrow as PlayArrowIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { createConfigurationService } from '../services/configurationService'
import { useCustomer } from '../hooks/useCustomer'
import type { SavedOrder } from '../types/savedOrder'
import type { SavedConfiguration } from '../types/customerMetafields'

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

// Convert SavedConfiguration to SavedOrder format for UI compatibility
const convertSavedConfigurationToOrder = (config: SavedConfiguration): SavedOrder => {
  return {
    id: config.id,
    orderNumber: config.id.split('_')[1] || config.id, // Use timestamp part as order number
    createdAt: new Date(config.savedAt),
    updatedAt: new Date(config.savedAt),
    status: 'saved' as const,
    version: '1.0',
    orderInfo: config.orderInfo,
    specifications: config.specifications.map(spec => ({
      materialId: spec.materialId,
      edgeMaterialId: spec.edgeMaterialId || null,
      glueType: spec.glueType,
      pieces: spec.pieces
    })),
    summary: {
      totalMaterials: config.summary.totalMaterials,
      totalPieces: config.summary.totalPieces,
      totalBoards: 0, // Not available in SavedConfiguration
      estimatedCost: config.summary.estimatedCost,
      currency: config.summary.currency,
      materialNames: config.materials.map(m => m.name)
    }
  }
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  onLoadConfiguration,
  onDeleteOrder
}) => {
  const { customer, isLoggedIn } = useCustomer()
  const [savedOrders, setSavedOrders] = useState<SavedOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load saved configurations when component mounts or customer changes
  useEffect(() => {
    const loadSavedConfigurations = async () => {
      if (!isLoggedIn || !customer) {
        setSavedOrders([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const configService = createConfigurationService()
        const configurations = await configService.getSavedConfigurations()

        // Convert SavedConfiguration to SavedOrder format
        const orders = configurations.map(convertSavedConfigurationToOrder)
        setSavedOrders(orders)
      } catch (err) {
        console.error('Error loading saved configurations:', err)
        setError('Chyba pri načítavaní uložených konfigurácií')
        setSavedOrders([])
      } finally {
        setLoading(false)
      }
    }

    loadSavedConfigurations()
  }, [customer, isLoggedIn])

  const handleDeleteOrder = async (order: SavedOrder) => {
    if (!customer) return

    try {
      const configService = createConfigurationService()
      const result = await configService.removeConfiguration(customer.id, order.id)

      if (result.success) {
        // Remove from local state
        setSavedOrders(orders => orders.filter(o => o.id !== order.id))
        onDeleteOrder?.(order)
      } else {
        setError(result.error || 'Chyba pri mazaní konfigurácie')
      }
    } catch (err) {
      console.error('Error deleting configuration:', err)
      setError('Chyba pri mazaní konfigurácie')
    }
  }

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Načítavam uložené konfigurácie...
        </Typography>
      </Paper>
    )
  }

  if (error) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </Paper>
    )
  }

  if (!isLoggedIn) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Prihláste sa pre zobrazenie uložených konfigurácií
        </Typography>
      </Paper>
    )
  }

  if (savedOrders.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Zatiaľ nemáte žiadne uložené konfigurácie
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>Konfigurácia</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Názov zákazky</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Dátum vytvorenia</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Kusov</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cena</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Akcie</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {savedOrders.map((order) => (
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
                    €{order.summary.estimatedCost.toFixed(2)}
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
                      onClick={() => handleDeleteOrder(order)}
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
          Zobrazuje sa 1 až {savedOrders.length} z {savedOrders.length} záznamov
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Stránka 1 z 1
        </Typography>
      </Box>
    </Paper>
  )
}

export default OrdersTable