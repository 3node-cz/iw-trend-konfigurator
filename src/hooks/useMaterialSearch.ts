import { useQuery } from '@tanstack/react-query'
import { searchMaterials } from '../services/shopifyApi'
import type { MaterialSearchParams, MaterialSearchResult } from '../types/shopify'

export const useMaterialSearch = (params: MaterialSearchParams) => {
  return useQuery({
    queryKey: ['materials', params],
    queryFn: () => searchMaterials(params),
    enabled: params.query.length >= 2, // Only search when query is long enough
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  })
}

export const useCollectionHierarchy = () => {
  return useQuery({
    queryKey: ['collections'],
    queryFn: () => import('../services/shopifyApi').then(api => api.getCollectionHierarchy()),
    staleTime: 30 * 60 * 1000, // 30 minutes - collections don't change often
    retry: 3
  })
}