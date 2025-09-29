import React, { useState, useCallback } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Button
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Clear as ClearIcon
} from '@mui/icons-material'
import MaterialSearch from './MaterialSearch'
import MaterialResultsTable from './MaterialResultsTable'
import { SaveOrderButton } from './common'
import { useMaterialSearch } from '../hooks/useMaterialSearch'
import { useCustomer } from '../hooks/useCustomer'
import type { MaterialSearchResult, SelectedMaterial } from '../types/shopify'
import type { OrderFormData } from '../schemas/orderSchema'
import { transformToSelectedMaterial } from '../utils/data-transformation'

interface MaterialSelectionPageProps {
  orderName?: string
  orderData?: OrderFormData | null
  initialSelectedMaterials?: SelectedMaterial[]
  onBack?: () => void
  onContinue?: (selectedMaterials: SelectedMaterial[]) => void
}

const MaterialSelectionPage: React.FC<MaterialSelectionPageProps> = ({
  orderName = "Aricoma",
  orderData,
  initialSelectedMaterials = [],
  onBack,
  onContinue
}) => {
  const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterial[]>(initialSelectedMaterials)
  const { customer } = useCustomer()

  // Material search hook
  const {
    searchResults,
    isLoadingSearch,
    searchQuery,
    showingAvailableOnly,
    handleSearch,
    handleShowAll,
  } = useMaterialSearch()


  const handleAddMaterial = (material: MaterialSearchResult) => {
    // Check if material is already selected
    const isAlreadySelected = selectedMaterials.some(selected => selected.id === material.id)
    if (isAlreadySelected) {
      return // Don't add duplicate materials
    }

    // Validate that essential variant data is present - NO FALLBACKS
    if (!material.variant?.id) {
      console.error('Material missing variant ID:', material)
      alert('Chyba: Tento materiál nemá dostupnú variantu pre objednávku. Skúste iný materiál.')
      return
    }

    if (!material.variant?.price) {
      console.error('Material missing variant price:', material)
      alert('Chyba: Tento materiál nemá dostupnú cenu. Skúste iný materiál.')
      return
    }

    const quantity = material.variant.inventoryQuantity || 1;
    const selectedMaterial = transformToSelectedMaterial(material, quantity);

    setSelectedMaterials(prev => [...prev, selectedMaterial])
  }

  const handleRemoveMaterial = (materialId: string) => {
    setSelectedMaterials(prev => prev.filter(m => m.id !== materialId))
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
  }

  return (
    <Container maxWidth={false} sx={{ maxWidth: '1920px', mx: 'auto', py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
          >
            Späť
          </Button>
          <Typography variant="h4" component="h1" sx={{ color: 'primary.main', fontWeight: 500 }}>
            {orderName}
          </Typography>
        </Box>

        <SaveOrderButton
          currentStep="material-selection"
          orderData={orderData}
          selectedMaterials={selectedMaterials}
          cuttingSpecifications={[]}
          customerId={customer?.id}
          onSaveSuccess={() => {
            // Could show a success message or refresh saved orders list
          }}
          onSaveError={(error) => {
            // Could show error in a snackbar
            console.error('Save error:', error)
          }}
        />
      </Box>

      {/* Search Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <MaterialSearch 
          onSearch={handleSearch}
          isLoading={isLoadingSearch}
          placeholder="Zadajte kód produktu alebo hľadaný výraz, napr. StrongMax"
          searchValue={searchQuery}
        />
      </Paper>

      {/* Results Section */}
      {searchResults.length > 0 && (
        <Paper sx={{ mb: 3, p: 3 }}>

          {/* Show All Button - only when showing available products and we have results */}
          {showingAvailableOnly && searchResults.length >= 10 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleShowAll}
                disabled={isLoadingSearch}
                sx={{ 
                  borderRadius: 3,
                  textTransform: 'none',
                  px: 3
                }}
              >
                Zobraziť všetky produkty (vrátane nedostupných)
              </Button>
            </Box>
          )}

          {/* Results summary */}
          {searchResults.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {showingAvailableOnly ? 
                `Zobrazených ${searchResults.length} dostupných produktov` : 
                `Zobrazených ${searchResults.length} produktov celkom`
              }
            </Typography>
          )}

          <MaterialResultsTable
            results={searchResults}
            onAddMaterial={handleAddMaterial}
            showViewAllButton={searchResults.length >= 5}
            selectedMaterialIds={selectedMaterials.map(m => m.id)}
          />
        </Paper>
      )}

      {/* Selected Materials Section */}
      {selectedMaterials.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Vybrané materiály ({selectedMaterials.length})
          </Typography>
          <MaterialResultsTable
            results={selectedMaterials.map(material => ({
              id: material.id,
              title: material.name,
              handle: material.code,
              vendor: 'Vendor',
              productType: 'Material',
              tags: [],
              variant: {
                id: material.id,
                title: material.name,
                sku: material.code,
                price: material.price.toString(),
                inventoryQuantity: material.quantity,
                availableForSale: true,
                metafields: {}
              },
              metafields: {},
              image: material.image
            }))
          }
          onRemoveMaterial={handleRemoveMaterial}
            isSelectedMaterials
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => setSelectedMaterials([])}
            >
              Zmazať všetko
            </Button>
            <Button
              variant="contained"
              onClick={() => onContinue?.(selectedMaterials)}
            >
              Pokračovať ({selectedMaterials.length})
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  )
}

export default MaterialSelectionPage