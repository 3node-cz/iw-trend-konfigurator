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
  Delete as DeleteIcon
} from '@mui/icons-material'
import { createConfigurationService } from '../services/configurationService'
import { useCustomer } from '../hooks/useCustomer'
import type { SavedConfiguration } from '../types/optimized-saved-config'

interface OrdersTableProps {
  onLoadConfiguration?: (order: SavedConfiguration) => void // Loads config and goes to order summary
  onDeleteOrder?: (order: SavedConfiguration) => void
  filters?: {
    searchText: string
    dateFrom: Date | null
    dateTo: Date | null
  }
}

const getStateColor = (status: 'draft' | 'saved' | 'submitted' | 'processing' | 'completed' | 'cancelled') => {
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

const getStateLabel = (status: 'draft' | 'saved' | 'submitted' | 'processing' | 'completed' | 'cancelled') => {
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

// Helper functions for SavedConfiguration display
const getOrderNumber = (config: SavedConfiguration) => {
  return config.id.split('_')[1] || config.id.slice(-8)
}

const getTotalPieces = (config: SavedConfiguration) => {
  return config.specifications.reduce((sum, spec) =>
    sum + spec.pieces.reduce((pieceSum, piece) => pieceSum + piece.quantity, 0), 0
  )
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  onLoadConfiguration,
  onDeleteOrder,
  filters
}) => {
  const { customer, isLoggedIn } = useCustomer()
  const [savedConfigurations, setSavedConfigurations] = useState<SavedConfiguration[]>([])
  const [filteredConfigurations, setFilteredConfigurations] = useState<SavedConfiguration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load saved configurations when component mounts or customer changes
  useEffect(() => {
    const loadSavedConfigurations = async () => {
      if (!isLoggedIn || !customer) {
        setSavedConfigurations([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const configService = createConfigurationService()
        const configurations = await configService.getSavedConfigurations()

        setSavedConfigurations(configurations)
        setFilteredConfigurations(configurations) // Initialize filtered data
      } catch (err) {
        console.error('Error loading saved configurations:', err)
        setError('Chyba pri načítavaní uložených konfigurácií')
        setSavedConfigurations([])
        setFilteredConfigurations([])
      } finally {
        setLoading(false)
      }
    }

    loadSavedConfigurations()
  }, [customer, isLoggedIn])

  // Apply filters whenever filters or saved configurations change
  useEffect(() => {
    if (!filters) {
      setFilteredConfigurations(savedConfigurations)
      return
    }

    const filtered = savedConfigurations.filter(config => {
      // Text search in order name and configuration name
      const searchMatch = !filters.searchText ||
        config.orderInfo.orderName.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        config.name.toLowerCase().includes(filters.searchText.toLowerCase())

      // Date range filtering (check savedAt date)
      const configDate = new Date(config.savedAt)
      const dateFromMatch = !filters.dateFrom || configDate >= filters.dateFrom
      const dateToMatch = !filters.dateTo || configDate <= filters.dateTo

      return searchMatch && dateFromMatch && dateToMatch
    })

    setFilteredConfigurations(filtered)
  }, [filters, savedConfigurations])

  const handleDeleteOrder = async (config: SavedConfiguration) => {
    if (!customer) return

    try {
      const configService = createConfigurationService()
      const result = await configService.deleteSavedConfiguration(config.id)

      if (result.success) {
        // Remove from both local states
        setSavedConfigurations(configs => configs.filter(c => c.id !== config.id))
        setFilteredConfigurations(configs => configs.filter(c => c.id !== config.id))
        onDeleteOrder?.(config)
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

  if (savedConfigurations.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Zatiaľ nemáte žiadne uložené konfigurácie
        </Typography>
      </Paper>
    )
  }

  if (filteredConfigurations.length === 0 && savedConfigurations.length > 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Žiadne konfigurácie nevyhovujú zadaným filtrom
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
              <TableCell sx={{ fontWeight: 600 }}>Akcie</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredConfigurations.map((config) => (
              <TableRow
                key={config.id}
                hover
                onClick={() => onLoadConfiguration?.(config)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <TableCell>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                    {config.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {config.orderInfo.orderName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(new Date(config.savedAt))}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {getTotalPieces(config)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation() // Prevent row click when deleting
                      handleDeleteOrder(config)
                    }}
                    title="Zmazať"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </Paper>
  )
}

export default OrdersTable