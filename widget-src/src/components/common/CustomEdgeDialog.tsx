import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Typography,
  Box,
  InputAdornment,
  CircularProgress,
  Avatar,
} from '@mui/material'
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material'
import { searchEdgeMaterials } from '../../services/shopifyApi'
import type { EdgeMaterial, MaterialSearchResult } from '../../types/shopify'
import { AvailabilityChip } from './index'
import { calculateAvailability } from '../../utils/availability'
import { useCustomer } from '../../hooks/useCustomer'
import { applyCustomerPricingToEdges } from '../../services/customerPricingService'

interface CustomEdgeDialogProps {
  open: boolean
  onClose: () => void
  onSave: (edges: {
    customEdgeTop: EdgeMaterial | null
    customEdgeBottom: EdgeMaterial | null
    customEdgeLeft: EdgeMaterial | null
    customEdgeRight: EdgeMaterial | null
  }) => void
  initialEdges: {
    customEdgeTop?: EdgeMaterial | null
    customEdgeBottom?: EdgeMaterial | null
    customEdgeLeft?: EdgeMaterial | null
    customEdgeRight?: EdgeMaterial | null
  }
}

type EdgePosition = 'top' | 'bottom' | 'left' | 'right'

const CustomEdgeDialog: React.FC<CustomEdgeDialogProps> = ({
  open,
  onClose,
  onSave,
  initialEdges,
}) => {
  // Get customer for pricing
  const { customer } = useCustomer()

  // Selected edges state
  const [customEdgeTop, setCustomEdgeTop] = useState<EdgeMaterial | null>(
    initialEdges.customEdgeTop || null
  )
  const [customEdgeBottom, setCustomEdgeBottom] = useState<EdgeMaterial | null>(
    initialEdges.customEdgeBottom || null
  )
  const [customEdgeLeft, setCustomEdgeLeft] = useState<EdgeMaterial | null>(
    initialEdges.customEdgeLeft || null
  )
  const [customEdgeRight, setCustomEdgeRight] = useState<EdgeMaterial | null>(
    initialEdges.customEdgeRight || null
  )

  // Search states for each edge
  const [searchQueries, setSearchQueries] = useState({
    top: '',
    bottom: '',
    left: '',
    right: '',
  })
  const [searchResults, setSearchResults] = useState<{
    top: MaterialSearchResult[]
    bottom: MaterialSearchResult[]
    left: MaterialSearchResult[]
    right: MaterialSearchResult[]
  }>({
    top: [],
    bottom: [],
    left: [],
    right: [],
  })
  const [isSearching, setIsSearching] = useState({
    top: false,
    bottom: false,
    left: false,
    right: false,
  })

  // Reset state when dialog opens with new initialEdges
  useEffect(() => {
    if (open) {
      setCustomEdgeTop(initialEdges.customEdgeTop || null)
      setCustomEdgeBottom(initialEdges.customEdgeBottom || null)
      setCustomEdgeLeft(initialEdges.customEdgeLeft || null)
      setCustomEdgeRight(initialEdges.customEdgeRight || null)
    }
  }, [open, initialEdges])

  const handleSearch = async (position: EdgePosition, query: string) => {
    setSearchQueries((prev) => ({ ...prev, [position]: query }))

    if (query.length < 2) {
      setSearchResults((prev) => ({ ...prev, [position]: [] }))
      return
    }

    setIsSearching((prev) => ({ ...prev, [position]: true }))
    try {
      const results = await searchEdgeMaterials({ query, limit: 5 })

      // Apply customer pricing to search results
      if (customer && results.length > 0) {
        const edgeMaterials = results.map(convertToEdgeMaterial)
        const pricedEdges = applyCustomerPricingToEdges(edgeMaterials, customer)

        // Convert back to MaterialSearchResult for display
        const pricedResults = results.map((result, index) => ({
          ...result,
          variant: result.variant ? {
            ...result.variant,
            price: pricedEdges[index].price?.amount.toString() || result.variant.price
          } : result.variant
        }))

        setSearchResults((prev) => ({ ...prev, [position]: pricedResults }))
      } else {
        setSearchResults((prev) => ({ ...prev, [position]: results }))
      }
    } catch (error) {
      console.error(`Error searching ${position} edge:`, error)
      setSearchResults((prev) => ({ ...prev, [position]: [] }))
    } finally {
      setIsSearching((prev) => ({ ...prev, [position]: false }))
    }
  }

  const convertToEdgeMaterial = (
    result: MaterialSearchResult
  ): EdgeMaterial => {
    const edgeMaterial = {
      id: result.id,
      variantId: result.variant?.id,
      code: result.variant?.sku || result.handle,
      name: result.title,
      productCode: result.variant?.sku || result.handle,
      availability: calculateAvailability(result),
      thickness: 0.8,
      availableThicknesses: [0.4, 0.8, 2],
      warehouse: result.vendor || 'Default',
      price: result.variant?.price
        ? {
            amount: parseFloat(result.variant.price),
            currency: 'EUR',
            perUnit: 'm',
          }
        : undefined,
      image: result.image,
    }

    console.log('🔄 [CustomEdgeDialog] Converting to EdgeMaterial:', {
      resultImage: result.image,
      edgeMaterialImage: edgeMaterial.image,
      name: edgeMaterial.name,
    })

    return edgeMaterial
  }

  const handleSelectEdge = (
    position: EdgePosition,
    result: MaterialSearchResult
  ) => {
    const edge = convertToEdgeMaterial(result)

    // Apply customer pricing to the selected edge
    const pricedEdge = customer
      ? applyCustomerPricingToEdges([edge], customer)[0]
      : edge

    switch (position) {
      case 'top':
        setCustomEdgeTop(pricedEdge)
        break
      case 'bottom':
        setCustomEdgeBottom(pricedEdge)
        break
      case 'left':
        setCustomEdgeLeft(pricedEdge)
        break
      case 'right':
        setCustomEdgeRight(pricedEdge)
        break
    }
    setSearchQueries((prev) => ({ ...prev, [position]: '' }))
    setSearchResults((prev) => ({ ...prev, [position]: [] }))
  }

  const handleClearEdge = (position: EdgePosition) => {
    switch (position) {
      case 'top':
        setCustomEdgeTop(null)
        break
      case 'bottom':
        setCustomEdgeBottom(null)
        break
      case 'left':
        setCustomEdgeLeft(null)
        break
      case 'right':
        setCustomEdgeRight(null)
        break
    }
  }

  const handleSave = () => {
    onSave({
      customEdgeTop,
      customEdgeBottom,
      customEdgeLeft,
      customEdgeRight,
    })
    onClose()
  }

  const renderEdgeSearch = (
    position: EdgePosition,
    label: string,
    selectedEdge: EdgeMaterial | null
  ) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        {label}
      </Typography>

      {/* Search field */}
      <TextField
        fullWidth
        size="small"
        placeholder={`Hľadať hranu pre ${label.toLowerCase()}...`}
        value={searchQueries[position]}
        onChange={(e) => handleSearch(position, e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {isSearching[position] ? (
                <CircularProgress size={20} />
              ) : (
                <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              )}
            </InputAdornment>
          ),
          endAdornment: searchQueries[position] && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => handleSearch(position, '')}
                sx={{ p: 0.5 }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Search results */}
      {searchResults[position].length > 0 && (
        <Box sx={{ mt: 1 }}>
          {searchResults[position].map((result) => (
            <Button
              key={result.id}
              variant="outlined"
              size="small"
              onClick={() => handleSelectEdge(position, result)}
              sx={{
                justifyContent: 'flex-start',
                width: '100%',
                textAlign: 'left',
                mb: 0.5,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Avatar
                src={result.image}
                alt={result.title}
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 0.5,
                  bgcolor: '#f5f5f5',
                  flexShrink: 0,
                }}
                variant="rounded"
              >
                📏
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {result.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {result.variant?.sku || result.handle}
                </Typography>
              </Box>
              <AvailabilityChip
                availability={calculateAvailability(result)}
                size="small"
              />
            </Button>
          ))}
        </Box>
      )}

      {/* Selected edge */}
      {selectedEdge && (
        <Box
          sx={{
            mt: 1,
            p: 1.5,
            bgcolor: '#f8f9fa',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Avatar
            src={selectedEdge.image}
            alt={selectedEdge.name}
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              bgcolor: '#f5f5f5',
              flexShrink: 0,
            }}
            variant="rounded"
          >
            📏
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {selectedEdge.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {selectedEdge.productCode}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => handleClearEdge(position)}>
            <ClearIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
        }}
      >
        <Typography variant="h6" component="div">
          Iná hrana pre hrany
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'grey.500' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Vyberte rôzne hrany pre jednotlivé strany dielca. Hrúbku hrany
          nastavíte v tabuľke.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {renderEdgeSearch('top', 'Vrchná hrana', customEdgeTop)}
          {renderEdgeSearch('bottom', 'Spodná hrana', customEdgeBottom)}
          {renderEdgeSearch('left', 'Ľavá hrana', customEdgeLeft)}
          {renderEdgeSearch('right', 'Pravá hrana', customEdgeRight)}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Zrušiť
        </Button>
        <Button onClick={handleSave} variant="contained">
          Uložiť
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CustomEdgeDialog
