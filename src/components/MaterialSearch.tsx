import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Typography,
  IconButton
} from '@mui/material'
import {
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material'

interface MaterialSearchProps {
  onSearch: (query: string) => void
  isLoading?: boolean
  placeholder?: string
  searchValue?: string
}

const MaterialSearch: React.FC<MaterialSearchProps> = ({
  onSearch,
  isLoading = false,
  placeholder = "Zadajte kód produktu alebo hľadaný výraz",
  searchValue = ''
}) => {
  const [query, setQuery] = useState(searchValue)

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, onSearch])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleClearSearch = () => {
    setQuery('')
    onSearch('') // This will clear the results
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ minWidth: 'fit-content' }}>
          Materiál
        </Typography>
        <TextField
          fullWidth
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                )}
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearSearch}
                  sx={{ color: 'text.secondary' }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white'
            }
          }}
        />
      </Box>

      {/* Search Instructions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary">
          Produkty
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#666',
            backgroundColor: '#f5f5f5',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '12px'
          }}
        >
          Zobraziť všetko (6)
        </Typography>
      </Box>
    </Box>
  )
}

export default MaterialSearch