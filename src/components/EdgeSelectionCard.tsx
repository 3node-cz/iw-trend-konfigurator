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
  CircularProgress
} from '@mui/material'
import {
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material'
import { searchEdgeMaterials } from '../services/shopifyApi'
import type { EdgeMaterial, MaterialSearchResult } from '../types/shopify'

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
  onGlueTypeChange
}) => {
  const [edgeSearchQuery, setEdgeSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [edgeSearchResults, setEdgeSearchResults] = useState<MaterialSearchResult[]>([])

  // Mock edge materials data
  const mockEdgeMaterials: EdgeMaterial[] = [
    {
      id: '1',
      name: 'ABS8 H1180 ST37 Dub Halifax prírodný 23/0.8',
      productCode: '517353',
      availability: 'available',
      thickness: 0.8,
      warehouse: 'Bratislava'
    },
    {
      id: '2',
      name: 'ABS8 H1180 ST37 Dub Halifax prírodný 23/0.4',
      productCode: '517352',
      availability: 'available',
      thickness: 0.4,
      warehouse: 'Bratislava'
    },
    {
      id: '3',
      name: 'ABS8 H1180 ST37 Dub Halifax prírodný 23/2.0',
      productCode: '517354',
      availability: 'limited',
      thickness: 2.0,
      warehouse: 'Žilina'
    }
  ]

  const glueTypes = [
    'PUR transparentná/bílá',
    'PUR čierna',
    'EVA transparentná',
    'EVA čierna'
  ]

  const thicknessVariants = [0.4, 0.8, 2.0]

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'success'
      case 'unavailable':
        return 'error'
      case 'limited':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'Skladom'
      case 'unavailable':
        return 'Na objednávku'
      case 'limited':
        return 'Obmedzene'
      default:
        return availability
    }
  }

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
      console.log('🔍 Searching for edge materials:', query)
      const results = await searchEdgeMaterials({ 
        query: query,
        limit: 10
      })
      console.log('✅ Found', results.length, 'edge materials')
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

  // Convert MaterialSearchResult to EdgeMaterial
  const convertToEdgeMaterial = (result: MaterialSearchResult): EdgeMaterial => ({
    id: result.id,
    name: result.name,
    productCode: result.productCode || result.code,
    availability: result.availability,
    thickness: 0.8, // Default thickness, could be extracted from dimensions
    warehouse: result.warehouse
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
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
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
              )
            }}
          />
        </Box>

        {/* Edge Search Results */}
        {edgeSearchResults.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Výsledky vyhľadávania ({edgeSearchResults.length})
            </Typography>
            {edgeSearchResults.map((result) => (
              <Box key={result.id} sx={{ mb: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleSelectEdgeFromSearch(result)}
                  sx={{ 
                    justifyContent: 'space-between',
                    width: '100%',
                    textAlign: 'left',
                    px: 2,
                    py: 1
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {result.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {result.productCode || result.code} • {result.warehouse}
                    </Typography>
                  </Box>
                  <Chip
                    label={getAvailabilityText(result.availability)}
                    size="small"
                    color={getAvailabilityColor(result.availability)}
                    variant="outlined"
                  />
                </Button>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
          </Box>
        )}

        {/* Selected Edge Display */}
        {selectedEdge ? (
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {selectedEdge.name} - Egger
            </Typography>
            
            <Typography variant="body2" color="primary" sx={{ fontWeight: 500, mb: 2 }}>
              {selectedEdge.productCode}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip
                label={getAvailabilityText(selectedEdge.availability)}
                size="small"
                color={getAvailabilityColor(selectedEdge.availability)}
                variant="outlined"
              />
              <Typography variant="caption" color="text.secondary">
                {selectedEdge.warehouse}
              </Typography>
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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Vyberte hranu pre materiál
            </Typography>
            
            {/* Quick Edge Selection */}
            {mockEdgeMaterials.slice(0, 2).map((edge) => (
              <Box key={edge.id} sx={{ mb: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleSelectEdge(edge)}
                  sx={{ 
                    justifyContent: 'flex-start',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  {edge.name}
                </Button>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />
          </Box>
        )}

        {/* Thickness Variants */}
        {selectedEdge && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Varianty hrúbky ({selectedEdge.thickness}mm vybrané)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {thicknessVariants.map((thickness) => (
                <Chip
                  key={thickness}
                  label={`${thickness}mm`}
                  size="small"
                  variant={thickness === selectedEdge.thickness ? 'filled' : 'outlined'}
                  color={thickness === selectedEdge.thickness ? 'primary' : 'default'}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Glue Type */}
        <FormControl fullWidth size="small">
          <InputLabel>Typ lepidla</InputLabel>
          <Select
            value={glueType}
            onChange={(e) => onGlueTypeChange(e.target.value)}
            label="Typ lepidla"
          >
            {glueTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  )
}

export default EdgeSelectionCard