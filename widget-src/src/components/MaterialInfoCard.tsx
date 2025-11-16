import React from 'react'
import type { MaterialSearchResult } from '../types/shopify'
import ProductSelectionCard from './ProductSelectionCard'

interface MaterialInfoCardProps {
  material: MaterialSearchResult
  // Material search props
  onMaterialSearch?: (query: string, params?: { warehouse?: string; collection?: string }) => void
  isSearching?: boolean
  searchQuery?: string
  searchResults?: MaterialSearchResult[]
  onSelectMaterial?: (material: MaterialSearchResult) => void
  selectedMaterialIds?: string[]
  customerDiscount?: number
}

const MaterialInfoCard: React.FC<MaterialInfoCardProps> = ({
  material,
  onMaterialSearch,
  isSearching = false,
  searchQuery = '',
  searchResults = [],
  onSelectMaterial,
  selectedMaterialIds = [],
  customerDiscount = 0,
}) => {
  const handleProductChange = (product: MaterialSearchResult | null) => {
    if (product && onSelectMaterial) {
      onSelectMaterial(product)
    }
  }

  const handleSearch = (query: string, params?: { warehouse?: string; collection?: string }) => {
    if (onMaterialSearch) {
      onMaterialSearch(query, params)
    }
  }

  return (
    <ProductSelectionCard
      title="Materiál"
      searchPlaceholder="Vyhľadať a zmeniť materiál..."
      emptyStateText="Vyberte materiál pre konfiguráciu"
      icon="📦"
      selectedProduct={material}
      onProductChange={handleProductChange}
      onSearch={handleSearch}
      isSearching={isSearching}
      searchQuery={searchQuery}
      searchResults={searchResults}
      selectedProductIds={selectedMaterialIds}
      customerDiscount={customerDiscount}
      useCustomResultsTable={true}
      showDeleteButton={false}
    />
  )
}

export default MaterialInfoCard
