import type { OrderFormData } from '../schemas/orderSchema'

/**
 * Optimized SavedConfiguration - Store only essential, non-calculable data
 * 75% smaller than previous format - only essentials
 */
export interface SavedConfiguration {
  // Metadata
  id: string
  name: string
  savedAt: string

  // Essential order info (non-calculable)
  orderInfo: OrderFormData

  // Essential material references (IDs only - everything else is fetched fresh)
  materials: Array<{
    id: string  // Product ID for fetching fresh data
  }>

  // Essential specifications (pieces only - material data is fetched)
  specifications: SavedCuttingSpecification[]
}

/**
 * Essential cutting specification data only
 */
export interface SavedCuttingSpecification {
  materialId: string
  glueType: string
  edgeMaterialId: string | null
  pieces: CuttingPieceEssentials[]
}

/**
 * Essential cutting piece data only
 */
export interface CuttingPieceEssentials {
  id: string
  partName: string
  length: number  // mm
  width: number   // mm
  quantity: number

  // Edge configuration (use enum values)
  edgeConfig: EdgeConfiguration

  // Options
  allowRotation: boolean
  notes?: string
}

/**
 * Unified edge configuration
 */
export interface EdgeConfiguration {
  type: EdgeType
  thickness?: number  // Only if edges are applied
}

export enum EdgeType {
  None = 'none',
  AllAround = 'all_around',
  Selective = 'selective'  // Custom edges per side
}

/**
 * Calculate summary data from essential data + fresh fetched data
 */
export interface CalculatedSummary {
  totalMaterials: number     // materials.length
  totalPieces: number        // sum of all piece quantities
  totalCost: number          // calculated from fresh prices
  currency: string           // always EUR from constants
  materialNames: string[]    // from fresh material data
}