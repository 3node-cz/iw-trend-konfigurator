import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Divider,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Avatar,
} from '@mui/material'
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material'
import { searchEdgeMaterials } from '../services/shopifyApi'
import type { EdgeMaterial, MaterialSearchResult } from '../types/shopify'
import { AvailabilityChip } from './common'
import { GLUE_TYPES } from '../constants'

interface EdgeSelectionCardProps {
  selectedEdge: EdgeMaterial | null
  glueType: string
  onEdgeChange: (edge: EdgeMaterial | null) => void
  onGlueTypeChange: (glueType: string) => void
}

const EdgeSelectionCard: React.FC<EdgeSelectionCardProps> = ({
  selectedEdge,
  glueType,
  onEdgeChange,
  onGlueTypeChange,
}) => {
  const [edgeSearchQuery, setEdgeSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [edgeSearchResults, setEdgeSearchResults] = useState<
    MaterialSearchResult[]
  >([])
  const [quickEdges, setQuickEdges] = useState<MaterialSearchResult[]>([])
  const [isLoadingQuickEdges, setIsLoadingQuickEdges] = useState(false)

  // Load popular edges on component mount
  useEffect(() => {
    const loadQuickEdges = async () => {
      setIsLoadingQuickEdges(true)
      try {
        const results = await searchEdgeMaterials({
          query: 'abs h1180',
          limit: 3,
        })
        setQuickEdges(results)
      } catch (error) {
        console.error('❌ Error loading popular edges:', error)
        // Fallback to mock data if API fails
        setQuickEdges([])
      } finally {
        setIsLoadingQuickEdges(false)
      }
    }

    loadQuickEdges()
  }, [])

  const glueTypes = GLUE_TYPES

  // Use available thicknesses from the selected edge material
  const thicknessVariants = selectedEdge?.availableThicknesses || [
    0.4, 0.8, 2.0,
  ]

  // Debounced search for edge materials
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (edgeSearchQuery.length >= 2) {
        handleEdgeSearch(edgeSearchQuery)
      } else {
        setEdgeSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [edgeSearchQuery])

  const handleEdgeSearch = async (query: string) => {
    if (query.length < 2) {
      setEdgeSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await searchEdgeMaterials({
        query: query,
        limit: 10,
      })
      setEdgeSearchResults(results)
    } catch (error) {
      console.error('❌ Edge search error:', error)
      setEdgeSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchInputChange = (query: string) => {
    setEdgeSearchQuery(query)
  }

  // Convert MaterialSearchResult to EdgeMaterial with image
  const convertToEdgeMaterial = (
    result: MaterialSearchResult,
  ): EdgeMaterial & { image?: string } => ({
    id: result.id,
    variantId: result.variant?.id,
    code: result.variant?.sku || result.handle,
    name: result.title,
    productCode: result.variant?.sku || result.handle,
    availability: result.variant?.availableForSale ? 'available' : 'unavailable',
    thickness: 0.8, // Default thickness, could be extracted from dimensions
    availableThicknesses: [0.4, 0.8, 2], // Common edge thickness variants
    warehouse: result.warehouse,
    price: result.variant?.price ? {
      amount: parseFloat(result.variant.price),
      currency: 'EUR',
      perUnit: 'm'
    } : undefined,
    image: result.image, // Add image from search result
  })

  const handleSelectEdge = (edge: EdgeMaterial) => {
    onEdgeChange(edge)
    setEdgeSearchQuery('') // Clear search after selection
    setEdgeSearchResults([]) // Clear results
  }

  const handleSelectEdgeFromSearch = (result: MaterialSearchResult) => {
    const edgeMaterial = convertToEdgeMaterial(result)
    handleSelectEdge(edgeMaterial)
  }

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 600 }}
        >
          Hrana
        </Typography>

        {/* Edge Search */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Hľadať hranu..."
            value={edgeSearchQuery}
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
              endAdornment: edgeSearchQuery && (
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

        {/* Edge Search Results */}
        {edgeSearchResults.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Výsledky vyhľadávania ({edgeSearchResults.length})
            </Typography>
            {edgeSearchResults.map((result) => (
              <Box
                key={result.id}
                sx={{ mb: 1 }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleSelectEdgeFromSearch(result)}
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
                  {/* Small edge preview image */}
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
                    {!result.image && '📏'}
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      {result.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {result.variant?.sku || result.handle} • {result.warehouse || 'warehouse'}
                    </Typography>
                  </Box>

                  <AvailabilityChip
                    availability={result.availability}
                    size="small"
                    sx={{ flexShrink: 0 }}
                  />
                </Button>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
          </Box>
        )}

        {/* Selected Edge Display */}
        {selectedEdge ? (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Vyberte hranu pre materiál
            </Typography>

            {/* Edge Preview Section */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mb: 2,
                p: 2,
                bgcolor: '#f8f9fa',
                borderRadius: 1,
              }}
            >
              <Avatar
                src={selectedEdge.image}
                alt={selectedEdge.name}
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 1,
                  bgcolor: '#f5f5f5',
                  border: '1px solid #e0e0e0',
                }}
                variant="rounded"
              >
                {!selectedEdge.image && '📏'}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, mb: 0.5, color: 'primary.main' }}
                >
                  {selectedEdge.name}
                </Typography>

                <Typography
                  variant="caption"
                  color="primary"
                  sx={{ display: 'block', mb: 0.5 }}
                >
                  {selectedEdge.productCode}
                </Typography>

                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                >
                  <AvailabilityChip
                    availability={selectedEdge.availability}
                    size="small"
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {selectedEdge.warehouse}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Button
              variant="outlined"
              size="small"
              onClick={() => onEdgeChange(null)}
              sx={{ mb: 2 }}
            >
              Zrušiť výber
            </Button>

            <Divider sx={{ my: 2 }} />
          </Box>
        ) : (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Vyberte hranu pre materiál
            </Typography>

            {/* Quick Edge Selection from API */}
            {isLoadingQuickEdges ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              quickEdges.slice(0, 2).map((result) => (
                <Box
                  key={result.id}
                  sx={{ mb: 1 }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleSelectEdgeFromSearch(result)}
                    sx={{
                      justifyContent: 'flex-start',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    {result.title}
                  </Button>
                </Box>
              ))
            )}

            <Divider sx={{ my: 2 }} />
          </Box>
        )}

        {/* Thickness Variants */}

        {/* Glue Type - Hidden for now */}
        {/* <FormControl
          fullWidth
          size="small"
        >
          <InputLabel>Typ lepidla</InputLabel>
          <Select
            value={glueType}
            onChange={(e) => onGlueTypeChange(e.target.value)}
            label="Typ lepidla"
          >
            {glueTypes.map((type) => (
              <MenuItem
                key={type}
                value={type}
              >
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
      </CardContent>
    </Card>
  )
}

export default EdgeSelectionCard
