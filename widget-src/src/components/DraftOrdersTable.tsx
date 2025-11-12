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
  IconButton,
  Typography,
  CircularProgress
} from '@mui/material'
import {
  Delete as DeleteIcon
} from '@mui/icons-material'
import { createDraftOrderService } from '../services/draftOrderService'
import { useCustomer } from '../hooks/useCustomer'
import type { SavedOrder } from '../types/savedOrder'

interface DraftOrdersTableProps {
  onLoadDraft?: (draft: SavedOrder) => void
  onDeleteDraft?: (draft: SavedOrder) => void
  filters?: {
    searchText: string
    dateFrom: Date | null
    dateTo: Date | null
  }
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('sk-SK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const DraftOrdersTable: React.FC<DraftOrdersTableProps> = ({
  onLoadDraft,
  onDeleteDraft,
  filters
}) => {
  const { customer, isLoggedIn } = useCustomer()
  const [draftOrders, setDraftOrders] = useState<SavedOrder[]>([])
  const [filteredDrafts, setFilteredDrafts] = useState<SavedOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load draft orders when component mounts or customer changes
  useEffect(() => {
    const loadDraftOrders = async () => {
      if (!isLoggedIn || !customer) {
        setDraftOrders([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const draftService = createDraftOrderService()
        const drafts = await draftService.getDraftOrders()

        setDraftOrders(drafts)
        setFilteredDrafts(drafts)
      } catch (err) {
        console.error('Error loading draft orders:', err)
        setError('Chyba pri načítavaní návrhov objednávok')
        setDraftOrders([])
        setFilteredDrafts([])
      } finally {
        setLoading(false)
      }
    }

    loadDraftOrders()
  }, [customer, isLoggedIn])

  // Apply filters whenever filters or draft orders change
  useEffect(() => {
    if (!filters) {
      setFilteredDrafts(draftOrders)
      return
    }

    const filtered = draftOrders.filter(draft => {
      // Text search in order name
      const searchMatch = !filters.searchText ||
        draft.orderInfo.orderName.toLowerCase().includes(filters.searchText.toLowerCase())

      // Date range filtering
      const draftDate = new Date(draft.createdAt)
      const dateFromMatch = !filters.dateFrom || draftDate >= filters.dateFrom
      const dateToMatch = !filters.dateTo || draftDate <= filters.dateTo

      return searchMatch && dateFromMatch && dateToMatch
    })

    setFilteredDrafts(filtered)
  }, [filters, draftOrders])

  const handleDeleteDraft = async (draft: SavedOrder) => {
    if (!customer) return

    try {
      const draftService = createDraftOrderService()
      const result = await draftService.deleteDraftOrder(draft.id)

      if (result.success) {
        setDraftOrders(drafts => drafts.filter(d => d.id !== draft.id))
        setFilteredDrafts(drafts => drafts.filter(d => d.id !== draft.id))
        onDeleteDraft?.(draft)
      } else {
        setError(result.error || 'Chyba pri mazaní návrhu objednávky')
      }
    } catch (err) {
      console.error('Error deleting draft order:', err)
      setError('Chyba pri mazaní návrhu objednávky')
    }
  }

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Načítavam návrhy objednávok...
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
          Prihláste sa pre zobrazenie návrhov objednávok
        </Typography>
      </Paper>
    )
  }

  if (draftOrders.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Zatiaľ nemáte žiadne rozpracované objednávky
        </Typography>
      </Paper>
    )
  }

  if (filteredDrafts.length === 0 && draftOrders.length > 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Žiadne návrhy nevyhovujú zadaným filtrom
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
              <TableCell sx={{ fontWeight: 600 }}>Názov zákazky</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Dátum vytvorenia</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Kusov</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Materiály</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Akcie</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDrafts.map((draft) => (
              <TableRow
                key={draft.id}
                hover
                onClick={() => onLoadDraft?.(draft)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {draft.orderInfo.orderName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(new Date(draft.createdAt))}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {draft.summary.totalPieces}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    {draft.summary.materialNames.slice(0, 2).join(', ')}
                    {draft.summary.materialNames.length > 2 && ` +${draft.summary.materialNames.length - 2}`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteDraft(draft)
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

export default DraftOrdersTable
