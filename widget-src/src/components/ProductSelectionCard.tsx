import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material'
import { Search as SearchIcon, Clear as ClearIcon, Delete as DeleteIcon } from '@mui/icons-material'
import type { MaterialSearchResult } from '../types/shopify'
import { AvailabilityChip } from './common'
import { calculateAvailability } from '../utils/availability'
import MaterialResultsTable from './MaterialResultsTable'

interface ProductSelectionCardProps {
  // Display configuration
  title: string
  searchPlaceholder: string
  emptyStateText?: string
  icon?: string // emoji icon when no image

  // Selected product
  selectedProduct: MaterialSearchResult | null
  onProductChange: (product: MaterialSearchResult | null) => void

  // Search functionality
  onSearch: (query: string, params?: { warehouse?: string; collection?: string }) => void | Promise<void>
  isSearching?: boolean
  searchQuery?: string
  searchResults?: MaterialSearchResult[]

  // Quick selection (for edges)
  showQuickSelection?: boolean
  quickSelectionItems?: MaterialSearchResult[]
  isLoadingQuickSelection?: boolean

  // Additional props
  showDeleteButton?: boolean
  selectedProductIds?: string[]
  customerDiscount?: number

  // Custom search results display
  useCustomResultsTable?: boolean
}

const ProductSelectionCard: React.FC<ProductSelectionCardProps> = ({
  title,
  searchPlaceholder,
  emptyStateText,
  icon = '📦',
  selectedProduct,
  onProductChange,
  onSearch,
  isSearching = false,
  searchQuery = '',
  searchResults = [],
  showQuickSelection = false,
  quickSelectionItems = [],
  isLoadingQuickSelection = false,
  showDeleteButton = false,
  selectedProductIds = [],
  customerDiscount = 0,
  useCustomResultsTable = false,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

  // Sync local state with prop
  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearchQuery.length >= 2) {
        onSearch(localSearchQuery)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [localSearchQuery]) // Removed onSearch to prevent infinite loops - only trigger on query change

  const handleSearchInputChange = (query: string) => {
    setLocalSearchQuery(query)
  }

  const handleSelectProduct = (result: MaterialSearchResult) => {
    onProductChange(result)
    setLocalSearchQuery('')
  }

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 600 }}
        >
          {title}
        </Typography>

        {/* Search Input */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={searchPlaceholder}
            value={localSearchQuery}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {isSearching ? (
                    <CircularProgress size={20} />
                  ) : (
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  )}
                </InputAdornment>
              ),
              endAdornment: localSearchQuery && (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    onClick={() => handleSearchInputChange('')}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    <ClearIcon fontSize="small" />
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {useCustomResultsTable ? (
              <MaterialResultsTable
                results={searchResults}
                onAddMaterial={handleSelectProduct}
                selectedMaterialIds={selectedProductIds}
                customerDiscount={customerDiscount}
              />
            ) : (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Výsledky vyhľadávania ({searchResults.length})
                </Typography>
                {searchResults.map((result) => (
                  <Box key={result.id} sx={{ mb: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleSelectProduct(result)}
                      sx={{
                        justifyContent: 'flex-start',
                        width: '100%',
                        textAlign: 'left',
                        px: 2,
                        py: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Avatar
                        src={result.image}
                        alt={result.title}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          bgcolor: '#f5f5f5',
                          border: '1px solid #e0e0e0',
                          flexShrink: 0,
                        }}
                        variant="rounded"
                      >
                        {!result.image && icon}
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                          {result.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {result.variant?.sku || result.handle}
                        </Typography>
                      </Box>

                      <AvailabilityChip
                        availability={calculateAvailability(result)}
                        size="small"
                        sx={{ flexShrink: 0 }}
                      />
                    </Button>
                  </Box>
                ))}
              </>
            )}
            <Divider sx={{ my: 2 }} />
          </Box>
        )}

        {/* No results message */}
        {localSearchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
          <Typography
            variant="body2"
            sx={{ mt: 2, mb: 3, color: "text.secondary", textAlign: "center" }}
          >
            Nenašli sa žiadne výsledky pre "{localSearchQuery}"
          </Typography>
        )}

        {/* Selected Product or Quick Selection */}
        {selectedProduct ? (
          <Box>
            {/* Product Preview Section */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Avatar
                src={selectedProduct.image}
                alt={selectedProduct.title}
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 1,
                  bgcolor: '#f5f5f5',
                  border: '1px solid #e0e0e0',
                }}
                variant="rounded"
              >
                {!selectedProduct.image && icon}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, mb: 1, color: 'primary.main' }}
                >
                  {selectedProduct.title || '[No Title]'}
                </Typography>

                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ fontWeight: 500, mb: 1 }}
                >
                  {selectedProduct.variant?.sku || selectedProduct.handle || '[No SKU/Handle]'}
                </Typography>

                {/* Availability chip without label */}
                {selectedProduct.variant?.inventoryQuantity !== undefined && (
                  <AvailabilityChip
                    availability={calculateAvailability(selectedProduct)}
                    size="small"
                  />
                )}
              </Box>

              {showDeleteButton && (
                <Box>
                  <Tooltip title={`Odstrániť ${title.toLowerCase()}`}>
                    <IconButton
                      onClick={() => onProductChange(null)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <Box>
            {emptyStateText && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                {emptyStateText}
              </Typography>
            )}

            {/* Quick Selection */}
            {showQuickSelection && (
              <>
                {isLoadingQuickSelection ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  quickSelectionItems.slice(0, 2).map((result) => (
                    <Box key={result.id} sx={{ mb: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleSelectProduct(result)}
                        sx={{
                          justifyContent: 'flex-start',
                          width: '100%',
                          textAlign: 'left',
                          px: 2,
                          py: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Avatar
                          src={result.image}
                          alt={result.title}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            bgcolor: '#f5f5f5',
                            border: '1px solid #e0e0e0',
                            flexShrink: 0,
                          }}
                          variant="rounded"
                        >
                          {!result.image && icon}
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                            {result.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {result.variant?.sku || result.handle}
                          </Typography>
                        </Box>

                        <AvailabilityChip
                          availability={calculateAvailability(result)}
                          size="small"
                          sx={{ flexShrink: 0 }}
                        />
                      </Button>
                    </Box>
                  ))
                )}
              </>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default ProductSelectionCard
