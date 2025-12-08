import { useState, useCallback, useEffect } from 'react'
import { searchMaterials } from '../services/shopifyApi'
import type { MaterialSearchResult } from '../types/shopify'
import { COLLECTIONS } from '../constants'
import { applyCustomerPricing } from '../services/customerPricingService'
import type { CustomerOrderData } from '../services/customerApi'

interface UseMaterialSearchOptions {
  collection?: string
  defaultAvailableOnly?: boolean
  customer?: CustomerOrderData | null
}

interface UseMaterialSearchResult {
  searchResults: MaterialSearchResult[]
  isLoadingSearch: boolean
  searchQuery: string
  showingAvailableOnly: boolean
  handleSearch: (query: string) => Promise<void>
  handleShowAll: () => Promise<void>
  clearResults: () => void
}

/**
 * Reusable hook for material search functionality
 * Encapsulates common search logic to follow DRY principles
 */
export const useMaterialSearch = (
  options: UseMaterialSearchOptions = {}
): UseMaterialSearchResult => {
  const {
    collection = COLLECTIONS.BOARDS,
    defaultAvailableOnly = true,
    customer
  } = options

  const [searchResults, setSearchResults] = useState<MaterialSearchResult[]>([])
  const [baseResults, setBaseResults] = useState<MaterialSearchResult[]>([])
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showingAvailableOnly, setShowingAvailableOnly] = useState(defaultAvailableOnly)

  // Apply customer pricing when customer or base results change
  useEffect(() => {
    if (baseResults.length > 0) {
      const pricedResults = applyCustomerPricing(baseResults, customer)
      setSearchResults(pricedResults)
    }
  }, [customer?.id, baseResults])

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query)

    if (query.length < 2) {
      setSearchResults([])
      setBaseResults([])
      return
    }

    setIsLoadingSearch(true)
    try {
      const results = await searchMaterials({
        query: query,
        availableOnly: showingAvailableOnly,
        limit: showingAvailableOnly ? 10 : undefined,
        collection
      })

      // Store base results (pricing will be applied in useEffect)
      setBaseResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
      setBaseResults([])
    } finally {
      setIsLoadingSearch(false)
    }
  }, [showingAvailableOnly, collection])

  const handleShowAll = useCallback(async () => {
    setShowingAvailableOnly(false)
    if (searchQuery.length >= 2) {
      setIsLoadingSearch(true)
      try {
        const results = await searchMaterials({
          query: searchQuery,
          availableOnly: false,
          limit: undefined,
          collection
        })

        // Store base results (pricing will be applied in useEffect)
        setBaseResults(results)
      } catch (error) {
        console.error('Show all search error:', error)
        setSearchResults([])
        setBaseResults([])
      } finally {
        setIsLoadingSearch(false)
      }
    }
  }, [searchQuery, collection])

  const clearResults = useCallback(() => {
    setSearchResults([])
    setBaseResults([])
    setSearchQuery('')
  }, [])

  return {
    searchResults,
    isLoadingSearch,
    searchQuery,
    showingAvailableOnly,
    handleSearch,
    handleShowAll,
    clearResults
  }
}