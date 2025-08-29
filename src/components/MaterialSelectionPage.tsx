import React, { useState } from 'react'
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
import type { MaterialSearchResult, SelectedMaterial } from '../types/shopify'

interface MaterialSelectionPageProps {
  orderName?: string
  onBack?: () => void
  onContinue?: (selectedMaterials: SelectedMaterial[]) => void
}

const MaterialSelectionPage: React.FC<MaterialSelectionPageProps> = ({
  orderName = "Aricoma",
  onBack,
  onContinue
}) => {
  const [searchResults, setSearchResults] = useState<MaterialSearchResult[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterial[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = async (query: string) => {
    setSearchQuery(query) // Track the current search query
    
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    try {
      // TODO: Replace with actual Shopify API call
      // For now, mock data based on your images
      const mockResults: MaterialSearchResult[] = [
        {
          id: '1',
          code: 'H1180',
          name: 'DTD_H1180 ST37 Dub Halifax prírodný 2800/2070/18.6',
          productCode: '275048',
          availability: 'available' as const,
          warehouse: 'Bratislava',
          price: {
            amount: 118.8996,
            currency: 'EUR',
            perUnit: '/ ks'
          },
          totalPrice: {
            amount: 90.9129,
            currency: 'EUR'
          },
          discountInfo: '32 % / 0 %',
          quantity: 1,
          dimensions: {
            width: 2800,
            height: 2070,
            thickness: 18.6
          }
        },
        {
          id: '2', 
          code: 'H1180',
          name: 'DTD_H1181 ST37 Dub Halifax lakovaný 2800/2070/18.6',
          productCode: '275049',
          availability: 'available' as const,
          warehouse: 'Bratislava',
          price: {
            amount: 121.8424,
            currency: 'EUR',
            perUnit: '/ ks'
          },
          totalPrice: {
            amount: 92.8526,
            currency: 'EUR'
          },
          discountInfo: '32 % / 0 %',
          quantity: 1
        },
        {
          id: '3',
          code: 'H1181',
          name: 'DTD_H1181 ST37 Dub Halifax tmavý 2800/2070/18.6',
          productCode: '275050',
          availability: 'limited' as const,
          warehouse: 'Žilina',
          price: {
            amount: 125.5500,
            currency: 'EUR',
            perUnit: '/ ks'
          },
          totalPrice: {
            amount: 95.4180,
            currency: 'EUR'
          },
          discountInfo: '24 % / 0 %',
          quantity: 1
        },
        {
          id: '4',
          code: 'U999',
          name: 'DTD_U999 ST9 Dub Sanremo svetlý 2800/2070/18.6',
          productCode: '275051',
          availability: 'available' as const,
          warehouse: 'Bratislava',
          price: {
            amount: 110.2000,
            currency: 'EUR',
            perUnit: '/ ks'
          },
          totalPrice: {
            amount: 83.9520,
            currency: 'EUR'
          },
          discountInfo: '24 % / 0 %',
          quantity: 1
        },
        {
          id: '5',
          code: 'W980',
          name: 'DTD_W980 ST22 Béžová 2800/2070/18.6',
          productCode: '275052',
          availability: 'unavailable' as const,
          warehouse: 'Partizánske',
          price: {
            amount: 98.7500,
            currency: 'EUR',
            perUnit: '/ ks'
          },
          totalPrice: {
            amount: 75.0600,
            currency: 'EUR'
          },
          discountInfo: '24 % / 0 %',
          quantity: 1
        },
        {
          id: '6',
          code: 'F426',
          name: 'DTD_F426 ST10 Dekor Buk prírodný 2800/2070/18.6',
          productCode: '275053',
          availability: 'available' as const,
          warehouse: 'Bratislava',
          price: {
            amount: 104.3300,
            currency: 'EUR',
            perUnit: '/ ks'
          },
          totalPrice: {
            amount: 79.2916,
            currency: 'EUR'
          },
          discountInfo: '24 % / 0 %',
          quantity: 1
        }
      ].filter(item => 
        item.code.toLowerCase().includes(query.toLowerCase()) ||
        item.name.toLowerCase().includes(query.toLowerCase())
      )
      
      setSearchResults(mockResults)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMaterial = (material: MaterialSearchResult) => {
    // Check if material is already selected
    const isAlreadySelected = selectedMaterials.some(selected => selected.id === material.id)
    if (isAlreadySelected) {
      return // Don't add duplicate materials
    }

    const selectedMaterial: SelectedMaterial = {
      id: material.id,
      code: material.code,
      name: material.name,
      quantity: material.quantity || 1,
      price: material.price.amount,
      totalPrice: material.totalPrice?.amount || material.price.amount,
      variantId: `variant-${material.id}`
    }
    
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
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
        >
          Späť
        </Button>
        <Typography variant="h4" component="h1" sx={{ color: '#1976d2', fontWeight: 500 }}>
          {orderName}
        </Typography>
      </Box>

      {/* Search Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <MaterialSearch 
          onSearch={handleSearch}
          isLoading={isLoading}
          placeholder="Zadajte kód produktu alebo hľadaný výraz, napr. StrongMax"
          searchValue={searchQuery}
        />
      </Paper>

      {/* Results Section */}
      {searchResults.length > 0 && (
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6">
              Výsledky vyhľadávania ({searchResults.length})
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearSearch}
              size="small"
            >
              Vymazať výsledky
            </Button>
          </Box>
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
              code: material.code,
              name: material.name,
              productCode: '',
              availability: 'available' as const,
              warehouse: '',
              price: {
                amount: material.price,
                currency: 'EUR',
                perUnit: '/ ks'
              },
              totalPrice: {
                amount: material.totalPrice,
                currency: 'EUR'
              },
              quantity: material.quantity
            }))}
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