import { useState, useCallback } from 'react'
import { searchMaterials } from '../services/shopifyApi'
import type { MaterialSearchResult } from '../types/shopify'

interface UseMaterialSearchOptions {
  collection?: string
  defaultAvailableOnly?: boolean
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
    collection = 'dekorativne-plosne-materialy',
    defaultAvailableOnly = true
  } = options

  const [searchResults, setSearchResults] = useState<MaterialSearchResult[]>([])
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showingAvailableOnly, setShowingAvailableOnly] = useState(defaultAvailableOnly)

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query)

    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsLoadingSearch(true)
    try {
      console.log('🔍 Starting material search for:', query)

      const results = await searchMaterials({
        query: query,
        availableOnly: showingAvailableOnly,
        limit: showingAvailableOnly ? 10 : undefined,
        collection
      })

      console.log('✅ Search completed. Found', results.length, 'results')
      setSearchResults(results)
    } catch (error) {
      console.error('❌ Search error:', error)
      setSearchResults([])
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
        console.log('✅ Show all completed. Found', results.length, 'results')
        setSearchResults(results)
      } catch (error) {
        console.error('❌ Show all search error:', error)
        setSearchResults([])
      } finally {
        setIsLoadingSearch(false)
      }
    }
  }, [searchQuery, collection])

  const clearResults = useCallback(() => {
    setSearchResults([])
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