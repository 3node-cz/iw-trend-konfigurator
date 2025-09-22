import React, { useState } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography
} from '@mui/material'
import Grid from '@mui/system/Grid'
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

const OrdersFilters: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('')
  const [orderState, setOrderState] = useState('')
  const [orderType, setOrderType] = useState('')
  const [dateFrom, setDateFrom] = useState<Date | null>(null)
  const [dateTo, setDateTo] = useState<Date | null>(null)
  const [recordsPerPage, setRecordsPerPage] = useState(10)

  const handleClearFilters = () => {
    setOrderNumber('')
    setOrderState('')
    setOrderType('')
    setDateFrom(null)
    setDateTo(null)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          {/* Search Input */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Zadejte číslo zákazky, název zákazky, adresa převzdávací jednotky"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
            />
          </Grid>

          {/* Date Range */}
          <Grid size={{ xs: 12, md: 2 }}>
            <DatePicker
              label="Datum objednání od"
              value={dateFrom}
              onChange={(date) => setDateFrom(date)}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  sx: { '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <DatePicker
              label="Datum objednání do"
              value={dateTo}
              onChange={(date) => setDateTo(date)}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  sx: { '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }
                }
              }}
            />
          </Grid>

          {/* Action Buttons - Right aligned */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                sx={{ minWidth: 120 }}
              >
                Hledat
              </Button>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                sx={{ minWidth: 120 }}
              >
                Zrušit filtry
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Filter Row */}
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Všetky stavy zákazky</InputLabel>
                <Select
                  value={orderState}
                  onChange={(e) => setOrderState(e.target.value)}
                  label="Všetky stavy zákazky"
                  sx={{ backgroundColor: 'white' }}
                >
                  <MenuItem value="">Všetky stavy</MenuItem>
                  <MenuItem value="formattovani">Formátování</MenuItem>
                  <MenuItem value="rozrezavana">Rozrezávaná</MenuItem>
                  <MenuItem value="hotova">Hotová</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Všetky typy zákaziek</InputLabel>
                <Select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  label="Všetky typy zákaziek"
                  sx={{ backgroundColor: 'white' }}
                >
                  <MenuItem value="">Všetky typy</MenuItem>
                  <MenuItem value="standard">Štandardné</MenuItem>
                  <MenuItem value="express">Express</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                p: 1, 
                backgroundColor: '#f0f8ff', 
                borderRadius: 1, 
                border: '1px solid #e3f2fd' 
              }}>
                <FilterIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: 'primary.main', fontSize: '13px' }}>
                  Vyberte stav/typ zákazky a kliknite na tlačidlo Hľadať
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
                  Záznamov na stránke:
                </Typography>
                <FormControl size="small" sx={{ minWidth: 60 }}>
                  <Select
                    value={recordsPerPage}
                    onChange={(e) => setRecordsPerPage(Number(e.target.value))}
                    sx={{ backgroundColor: 'white' }}
                  >
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </LocalizationProvider>
  )
}

export default OrdersFilters