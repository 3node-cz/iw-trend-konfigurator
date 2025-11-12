import React, { useState, useEffect } from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  CircularProgress
} from '@mui/material'
import { createSubmittedOrderService, type SubmittedOrderReference } from '../services/submittedOrderService'
import { useCustomer } from '../hooks/useCustomer'

interface SubmittedOrdersTableProps {
  onViewOrder?: (order: SubmittedOrderReference) => void
  filters?: {
    searchText: string
    dateFrom: Date | null
    dateTo: Date | null
  }
}

const getStatusColor = (status: SubmittedOrderReference['status']) => {
  switch (status) {
    case 'draft':
      return 'default'
    case 'pending':
      return 'warning'
    case 'paid':
      return 'info'
    case 'fulfilled':
      return 'success'
    case 'cancelled':
      return 'error'
    default:
      return 'default'
  }
}

const getStatusLabel = (status: SubmittedOrderReference['status']) => {
  switch (status) {
    case 'draft':
      return 'Návrh'
    case 'pending':
      return 'Čaká na platbu'
    case 'paid':
      return 'Zaplatená'
    case 'fulfilled':
      return 'Vyriešená'
    case 'cancelled':
      return 'Zrušená'
    default:
      return status
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('sk-SK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const SubmittedOrdersTable: React.FC<SubmittedOrdersTableProps> = ({
  onViewOrder,
  filters
}) => {
  const { customer, isLoggedIn } = useCustomer()
  const [submittedOrders, setSubmittedOrders] = useState<SubmittedOrderReference[]>([])
  const [filteredOrders, setFilteredOrders] = useState<SubmittedOrderReference[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load submitted orders when component mounts or customer changes
  useEffect(() => {
    const loadSubmittedOrders = async () => {
      if (!isLoggedIn || !customer) {
        setSubmittedOrders([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const submittedService = createSubmittedOrderService()
        const orders = await submittedService.getSubmittedOrders()

        // Sort by submission date (newest first)
        const sortedOrders = orders.sort((a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        )

        setSubmittedOrders(sortedOrders)
        setFilteredOrders(sortedOrders)
      } catch (err) {
        console.error('Error loading submitted orders:', err)
        setError('Chyba pri načítavaní odoslaných objednávok')
        setSubmittedOrders([])
        setFilteredOrders([])
      } finally {
        setLoading(false)
      }
    }

    loadSubmittedOrders()
  }, [customer, isLoggedIn])

  // Apply filters whenever filters or orders change
  useEffect(() => {
    if (!filters) {
      setFilteredOrders(submittedOrders)
      return
    }

    const filtered = submittedOrders.filter(order => {
      // Text search in order name
      const searchMatch = !filters.searchText ||
        order.orderName.toLowerCase().includes(filters.searchText.toLowerCase())

      // Date range filtering
      const orderDate = new Date(order.submittedAt)
      const dateFromMatch = !filters.dateFrom || orderDate >= filters.dateFrom
      const dateToMatch = !filters.dateTo || orderDate <= filters.dateTo

      return searchMatch && dateFromMatch && dateToMatch
    })

    setFilteredOrders(filtered)
  }, [filters, submittedOrders])

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Načítavam odoslané objednávky...
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
          Prihláste sa pre zobrazenie odoslaných objednávok
        </Typography>
      </Paper>
    )
  }

  if (submittedOrders.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Zatiaľ nemáte žiadne odoslané objednávky
        </Typography>
      </Paper>
    )
  }

  if (filteredOrders.length === 0 && submittedOrders.length > 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Žiadne objednávky nevyhovujú zadaným filtrom
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
              <TableCell sx={{ fontWeight: 600 }}>Číslo objednávky</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Dátum odoslania</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Kusov</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Materiály</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Stav</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow
                key={order.id}
                hover
                onClick={() => onViewOrder?.(order)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <TableCell>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                    {order.orderName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(order.submittedAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {order.totalPieces}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    {order.materialNames.slice(0, 2).join(', ')}
                    {order.materialNames.length > 2 && ` +${order.materialNames.length - 2}`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(order.status)}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default SubmittedOrdersTable
