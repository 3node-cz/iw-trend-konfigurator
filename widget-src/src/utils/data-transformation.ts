// DRY DATA TRANSFORMATION UTILITIES
import type { MaterialSearchResult, CuttingSpecification, SelectedMaterial } from '../types/shopify'
import type { SavedConfiguration, CalculatedSummary, AppView } from '../types/optimized-saved-config'
import { PRICING } from '../constants'

/**
 * Transform MaterialSearchResult to SelectedMaterial (DRY - used in multiple places)
 */
export const transformToSelectedMaterial = (
  material: MaterialSearchResult,
  quantity: number = 1
): SelectedMaterial => {
  const price = material.variant?.price ? parseFloat(material.variant.price) : 0

  return {
    id: material.id,
    code: material.variant?.sku || material.handle,
    name: material.title,
    quantity,
    price,
    totalPrice: price * quantity,
    variantId: material.variant?.id || material.id,
    image: material.image || material.images?.[0]
  }
}

/**
 * Calculate quantities from cutting specifications (DRY)
 */
export const calculateMaterialQuantities = (specifications: CuttingSpecification[]): Map<string, number> => {
  const quantities = new Map<string, number>()

  specifications.forEach(spec => {
    const totalQuantity = spec.pieces.reduce((sum, piece) => sum + piece.quantity, 0)
    quantities.set(spec.material.id, totalQuantity)
  })

  return quantities
}

/**
 * Calculate total pieces across all specifications (DRY)
 */
export const calculateTotalPieces = (specifications: CuttingSpecification[]): number => {
  return specifications.reduce((total, spec) =>
    total + spec.pieces.reduce((sum, piece) => sum + piece.quantity, 0), 0
  )
}

/**
 * Calculate order summary from live data (DRY - replaces stored summary)
 */
export const calculateOrderSummary = (
  materials: MaterialSearchResult[],
  specifications: CuttingSpecification[]
): CalculatedSummary => {
  const quantities = calculateMaterialQuantities(specifications)

  const totalCost = materials.reduce((sum, material) => {
    const quantity = quantities.get(material.id) || 0
    const price = material.variant?.price ? parseFloat(material.variant.price) : 0
    return sum + (price * quantity)
  }, 0)

  const totalPieces = specifications.reduce((sum, spec) =>
    sum + spec.pieces.reduce((pieceSum, piece) => pieceSum + piece.quantity, 0), 0
  )

  return {
    totalMaterials: materials.length,
    totalPieces,
    totalCost,
    currency: PRICING.CURRENCY,
    materialNames: materials.map(m => m.title)
  }
}

/**
 * Create minimal saved configuration (DRY - removes redundancy)
 */
export const createMinimalSavedConfig = (
  name: string,
  orderInfo: any,
  materials: MaterialSearchResult[],
  specifications: CuttingSpecification[],
  savedFromStep: AppView = 'recapitulation'
): SavedConfiguration => {
  return {
    id: `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    savedAt: new Date().toISOString(),
    savedFromStep,
    orderInfo,
    // Store only IDs - everything else will be fetched fresh
    materials: materials.map(m => ({ id: m.id })),
    specifications: specifications.map(spec => ({
      materialId: spec.material.id,
      glueType: spec.glueType as any, // TODO: Update to use enum
      edgeMaterialId: spec.edgeMaterial?.id || null,
      pieces: spec.pieces.map(piece => ({
        id: piece.id,
        partName: piece.partName,
        length: piece.length,
        width: piece.width,
        quantity: piece.quantity,
        allowRotation: piece.allowRotation,
        withoutEdge: piece.withoutEdge,
        duplicate: piece.duplicate,
        // Preserve all edge settings
        edgeAllAround: piece.edgeAllAround,
        edgeTop: piece.edgeTop,
        edgeBottom: piece.edgeBottom,
        edgeLeft: piece.edgeLeft,
        edgeRight: piece.edgeRight,
        notes: piece.notes
      }))
    }))
  }
}

/**
 * Convert old saved config format to new optimized format (Migration helper)
 */
export const migrateToOptimizedFormat = (oldConfig: any): SavedConfiguration => {
  return {
    id: oldConfig.id,
    name: oldConfig.name,
    savedAt: oldConfig.savedAt,
    orderInfo: oldConfig.orderInfo,
    materials: oldConfig.materials.map((m: any) => ({ id: m.id })),
    specifications: oldConfig.specifications.map((spec: any) => ({
      materialId: spec.materialId,
      glueType: spec.glueType,
      edgeMaterialId: spec.edgeMaterialId,
      pieces: spec.pieces.map((piece: any) => ({
        id: piece.id,
        partName: piece.partName || '',
        length: piece.length,
        width: piece.width,
        quantity: piece.quantity,
        allowRotation: piece.allowRotation || false,
        withoutEdge: piece.withoutEdge || false,
        duplicate: piece.duplicate || false,
        // Preserve all edge settings
        edgeAllAround: piece.edgeAllAround || null,
        edgeTop: piece.edgeTop || null,
        edgeBottom: piece.edgeBottom || null,
        edgeLeft: piece.edgeLeft || null,
        edgeRight: piece.edgeRight || null,
        notes: piece.notes || ''
      }))
    }))
  }
}

/**
 * Validate data consistency (DRY - centralized validation)
 */
export const validateOrderData = (
  materials: MaterialSearchResult[],
  specifications: CuttingSpecification[]
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Check material-spec consistency
  if (materials.length !== specifications.length) {
    errors.push('Material count mismatch with specifications')
  }

  // Check for empty pieces
  specifications.forEach((spec, index) => {
    if (spec.pieces.length === 0) {
      errors.push(`Specification ${index + 1} has no cutting pieces`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}