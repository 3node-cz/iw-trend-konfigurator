import React, { useState, useEffect } from 'react'
import { searchEdgeMaterials } from '../services/shopifyApi'
import type { EdgeMaterial, MaterialSearchResult } from '../types/shopify'
import { calculateAvailability } from '../utils/availability'
import ProductSelectionCard from './ProductSelectionCard'
import { useCustomer } from '../hooks/useCustomer'
import { applyCustomerPricingToEdges } from '../services/customerPricingService'

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
  const { customer } = useCustomer()
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

        // Convert MaterialSearchResult to EdgeMaterial for customer pricing
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

        setQuickEdges(pricedResults)
      } catch (error) {
        console.error('❌ Error loading popular edges:', error)
        // Fallback to mock data if API fails
        setQuickEdges([])
      } finally {
        setIsLoadingQuickEdges(false)
      }
    }

    loadQuickEdges()
  }, [customer?.id])

  // Helper function to convert MaterialSearchResult to EdgeMaterial
  const convertToEdgeMaterial = (
    result: MaterialSearchResult,
  ): EdgeMaterial & { image?: string } => {
    return {
      id: result.id,
      variantId: result.variant?.id,
      code: result.variant?.sku || result.handle,
      name: result.title,
      productCode: result.variant?.sku || result.handle,
      availability: calculateAvailability(result),
      thickness: 0.8,
      availableThicknesses: [0.4, 0.8, 2],
      warehouse: result.warehouse,
      price: result.variant?.price ? {
        amount: parseFloat(result.variant.price),
        currency: 'EUR',
        perUnit: 'm'
      } : undefined,
      image: result.image,
      edgeWidth: 0.8, // Default values for required fields
      boardThickness: 18,
    };
  }

  // Handle search - called by ProductSelectionCard
  const handleSearch = async (query: string) => {
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

      // Apply customer pricing to search results
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

      setEdgeSearchResults(pricedResults)
    } catch (error) {
      console.error('❌ Edge search error:', error)
      setEdgeSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Handle product selection - converts MaterialSearchResult to EdgeMaterial
  const handleProductChange = (product: MaterialSearchResult | null) => {
    if (product) {
      const edgeMaterial = convertToEdgeMaterial(product)
      onEdgeChange(edgeMaterial)
      setEdgeSearchResults([])  // Clear search results after selection
    } else {
      onEdgeChange(null)
    }
  }

  // Convert selectedEdge (EdgeMaterial) back to MaterialSearchResult for display
  const selectedEdgeAsProduct: MaterialSearchResult | null = selectedEdge
    ? {
        id: selectedEdge.id,
        title: selectedEdge.name,
        handle: selectedEdge.productCode || '',
        vendor: '',
        productType: '',
        tags: [],
        image: selectedEdge.image,
        variant: selectedEdge.variantId
          ? {
              id: selectedEdge.variantId,
              title: '',
              sku: selectedEdge.code,
              price: selectedEdge.price?.amount?.toString() || '0',
              // Preserve availability: convert 'available' status to inventory > 0
              inventoryQuantity: selectedEdge.availability === 'available' ? 1 : 0,
            }
          : undefined,
        warehouse: selectedEdge.warehouse,
      }
    : null

  return (
    <ProductSelectionCard
      title="Hrana"
      searchPlaceholder="Hľadať hranu..."
      emptyStateText="Vyberte hranu pre materiál"
      icon="📏"
      selectedProduct={selectedEdgeAsProduct}
      onProductChange={handleProductChange}
      onSearch={handleSearch}
      isSearching={isSearching}
      searchResults={edgeSearchResults}
      showQuickSelection={true}
      quickSelectionItems={quickEdges}
      isLoadingQuickSelection={isLoadingQuickEdges}
      showDeleteButton={true}
      useCustomResultsTable={false}
    />
  )
}

export default EdgeSelectionCard
