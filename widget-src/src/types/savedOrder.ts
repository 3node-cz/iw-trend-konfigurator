import type { OrderFormData } from '../schemas/orderSchema'
import type { CuttingSpecification, CuttingPiece, OrderCalculations } from './shopify'
import type { CuttingLayoutData } from '../hooks/useCuttingLayouts'
import { PRICING } from '../constants'

// Lightweight specification storing only IDs for materials/edges
export interface SavedCuttingSpecification {
  materialId: string // Shopify product ID
  edgeMaterialId: string | null // Shopify product ID for edge material
  glueType: string
  pieces: CuttingPiece[]
}

// Unified saved order structure that can be stored as JSON
export interface SavedOrder {
  // Order identification
  id: string
  orderNumber: string
  createdAt: Date
  updatedAt: Date

  // Order status and metadata
  status: 'draft' | 'saved' | 'submitted' | 'processing' | 'completed' | 'cancelled'
  version: string // For schema versioning
  savedFromStep?: 'material-selection' | 'cutting-specification' | 'order-form' | 'recapitulation' // Track where draft was saved from

  // Basic order information (from form)
  orderInfo: OrderFormData

  // Material specifications and cutting pieces (only IDs stored)
  specifications: SavedCuttingSpecification[]

  // Pre-calculated layouts (optional, can be regenerated)
  cuttingLayouts?: CuttingLayoutData[]

  // Pre-calculated costs and measurements (optional, can be regenerated)
  orderCalculations?: OrderCalculations

  // Summary for quick display
  summary: {
    totalMaterials: number
    totalPieces: number
    totalBoards: number
    estimatedCost: number
    currency: string
    materialNames: string[] // For quick preview - cached from when order was saved
  }
}


// Helper function to create a new saved order
export const createSavedOrder = (
  orderInfo: OrderFormData,
  specifications: CuttingSpecification[],
  cuttingLayouts?: CuttingLayoutData[],
  orderCalculations?: OrderCalculations
): SavedOrder => {
  const id = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const orderNumber = Math.floor(Math.random() * 900000000) + 100000000

  // Convert full specifications to minimal format
  const savedSpecifications: SavedCuttingSpecification[] = specifications.map(spec => ({
    materialId: spec.material.id,
    edgeMaterialId: spec.edgeMaterial?.id || null,
    glueType: spec.glueType,
    pieces: spec.pieces
  }))

  // Calculate summary
  const totalMaterials = specifications.length
  const totalPieces = specifications.reduce((sum, spec) =>
    sum + spec.pieces.reduce((pieceSum, piece) => pieceSum + piece.quantity, 0), 0
  )
  const totalBoards = cuttingLayouts?.length || 0
  const materialNames = specifications.map(spec => spec.material.title)

  // Estimate cost (simplified calculation)
  const estimatedCost = specifications.reduce((sum, spec) => {
    const materialPrice = spec.material.variant?.price ? parseFloat(spec.material.variant.price) : 0
    const materialCost = materialPrice * spec.pieces.reduce((total, piece) => total + piece.quantity, 0)
    return sum + materialCost
  }, 0)

  return {
    id,
    orderNumber: orderNumber.toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'draft',
    version: '2.0',
    orderInfo,
    specifications: savedSpecifications,
    cuttingLayouts,
    orderCalculations,
    summary: {
      totalMaterials,
      totalPieces,
      totalBoards,
      estimatedCost,
      currency: 'EUR',
      materialNames
    }
  }
}

// Helper function to update a saved order
export const updateSavedOrder = (
  existingOrder: SavedOrder,
  updates: Partial<Omit<SavedOrder, 'id' | 'createdAt' | 'orderNumber'>>
): SavedOrder => {
  return {
    ...existingOrder,
    ...updates,
    updatedAt: new Date()
  }
}

// Helper function to calculate order summary from full specifications
export const calculateOrderSummary = (
  specifications: CuttingSpecification[],
  cuttingLayouts?: CuttingLayoutData[],
  orderCalculations?: OrderCalculations
) => {
  const totalMaterials = specifications.length
  const totalPieces = specifications.reduce((sum, spec) =>
    sum + spec.pieces.reduce((pieceSum, piece) => pieceSum + piece.quantity, 0), 0
  )
  const totalBoards = cuttingLayouts?.length || 0
  const materialNames = specifications.map(spec => spec.material.title)

  // Use order calculations if available, otherwise estimate
  const estimatedCost = orderCalculations?.totals?.totalCuttingCost ||
    specifications.reduce((sum, spec) => {
      const materialPrice = spec.material.variant?.price ? parseFloat(spec.material.variant.price) : 0
      const materialCost = materialPrice * spec.pieces.reduce((total, piece) => total + piece.quantity, 0)
      return sum + materialCost
    }, 0)

  return {
    totalMaterials,
    totalPieces,
    totalBoards,
    estimatedCost,
    currency: PRICING.CURRENCY,
    materialNames
  }
}