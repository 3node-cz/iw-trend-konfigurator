import type { CuttingPiece, EdgeMaterial } from '../types/shopify'

export interface EdgeConsumption {
  width: number // Edge width in mm (0.45, 1, 2)
  boardThickness: number // Board thickness in mm (18 or 36 for dupel)
  totalLength: number // Total length needed in mm
  totalLengthMeters: number // Total length needed in meters
  pieceCount: number // Number of pieces using this width/thickness combination
}

export interface MaterialEdgeConsumption {
  materialName: string
  edgeMaterialName: string
  edgeMaterial?: EdgeMaterial // The actual edge variant being used
  consumptionByVariant: EdgeConsumption[] // Consumption grouped by edge variant (width + board thickness)
  totalEdgeLength: number // Total across all variants in mm
  totalEdgeLengthMeters: number // Total across all variants in meters
  isPlaceholder?: boolean // True if this is a placeholder edge
  placeholderNote?: string // Note for placeholder edge orders
}

/**
 * Calculate edge material consumption for a cutting piece
 * Includes edge buffer (extra length on each side)
 *
 * @param piece - The cutting piece
 * @param edgeBuffer - Buffer per side in mm (default 30mm)
 */
export const calculatePieceEdgeConsumption = (
  piece: CuttingPiece,
  edgeBuffer: number = 30
): EdgeConsumption[] => {
  const consumptionMap = new Map<number, number>()

  // Calculate perimeter for each edge thickness
  // Edge length = piece edge + buffer on each side (2x buffer total)
  const addEdgeLength = (thickness: number | null, baseLength: number) => {
    if (thickness && thickness > 0) {
      const edgeLengthWithBuffer = baseLength + (edgeBuffer * 2)
      const current = consumptionMap.get(thickness) || 0
      consumptionMap.set(thickness, current + edgeLengthWithBuffer)
    }
  }

  // Always use individual edges for calculation since edgeAllAround is now reactive
  // If edgeAllAround was set, the individual edges will have been updated accordingly
  addEdgeLength(piece.edgeTop, piece.length * piece.quantity)
  addEdgeLength(piece.edgeBottom, piece.length * piece.quantity)
  addEdgeLength(piece.edgeLeft, piece.width * piece.quantity)
  addEdgeLength(piece.edgeRight, piece.width * piece.quantity)

  // Convert to EdgeConsumption array
  return Array.from(consumptionMap.entries()).map(
    ([thickness, totalLength]) => ({
      thickness,
      totalLength,
      totalLengthMeters: totalLength / 1000,
      pieceCount: 1, // Will be aggregated later
    }),
  )
}

/**
 * Calculate edge consumption for specific edges of a piece
 * Used when a piece has mixed edge materials
 *
 * @param piece - The cutting piece
 * @param includeEdges - Which edges to include in calculation
 * @param edgeBuffer - Buffer per side in mm (default 30mm)
 */
export const calculateSelectiveEdgeConsumption = (
  piece: CuttingPiece,
  includeEdges: {
    top?: boolean
    bottom?: boolean
    left?: boolean
    right?: boolean
  },
  edgeBuffer: number = 30
): EdgeConsumption[] => {
  const consumptionMap = new Map<number, number>()

  const addEdgeLength = (thickness: number | null, baseLength: number) => {
    if (thickness && thickness > 0) {
      const edgeLengthWithBuffer = baseLength + (edgeBuffer * 2)
      const current = consumptionMap.get(thickness) || 0
      consumptionMap.set(thickness, current + edgeLengthWithBuffer)
    }
  }

  // Only add edges that are included
  if (includeEdges.top) {
    addEdgeLength(piece.edgeTop, piece.length * piece.quantity)
  }
  if (includeEdges.bottom) {
    addEdgeLength(piece.edgeBottom, piece.length * piece.quantity)
  }
  if (includeEdges.left) {
    addEdgeLength(piece.edgeLeft, piece.width * piece.quantity)
  }
  if (includeEdges.right) {
    addEdgeLength(piece.edgeRight, piece.width * piece.quantity)
  }

  return Array.from(consumptionMap.entries()).map(
    ([thickness, totalLength]) => ({
      thickness,
      totalLength,
      totalLengthMeters: totalLength / 1000,
      pieceCount: 1,
    }),
  )
}

/**
 * Calculate total edge consumption for all pieces using the same edge material
 * @param edgeBuffer - Buffer per side in mm (default 30mm)
 */
export const calculateMaterialEdgeConsumption = (
  pieces: CuttingPiece[],
  materialName: string,
  edgeMaterialName: string,
  edgeBuffer: number = 30
): MaterialEdgeConsumption => {
  const consumptionMap = new Map<
    number,
    { length: number; pieceCount: number }
  >()

  // Process all pieces
  pieces.forEach((piece) => {
    const pieceConsumption = calculatePieceEdgeConsumption(piece, edgeBuffer)

    pieceConsumption.forEach((consumption) => {
      const existing = consumptionMap.get(consumption.thickness) || {
        length: 0,
        pieceCount: 0,
      }
      consumptionMap.set(consumption.thickness, {
        length: existing.length + consumption.totalLength,
        pieceCount: existing.pieceCount + piece.quantity,
      })
    })
  })

  // Convert to consumption array
  const consumptionByThickness: EdgeConsumption[] = Array.from(
    consumptionMap.entries(),
  ).map(([thickness, data]) => ({
    thickness,
    totalLength: data.length,
    totalLengthMeters: data.length / 1000,
    pieceCount: data.pieceCount,
  }))

  // Calculate totals
  const totalEdgeLength = consumptionByThickness.reduce(
    (sum, item) => sum + item.totalLength,
    0,
  )
  const totalEdgeLengthMeters = totalEdgeLength / 1000

  return {
    materialName,
    edgeMaterialName,
    consumptionByThickness,
    totalEdgeLength,
    totalEdgeLengthMeters,
  }
}

/**
 * Calculate edge consumption with support for mixed edge materials
 * Each piece edge is attributed to the correct edge material
 */
export const calculateMaterialEdgeConsumptionWithMixedEdges = (
  piecesWithEdgeInfo: Array<{
    piece: CuttingPiece
    includeEdges: {
      top?: boolean
      bottom?: boolean
      left?: boolean
      right?: boolean
    }
  }>,
  materialName: string,
  edgeMaterialName: string,
  edgeBuffer: number = 30
): MaterialEdgeConsumption => {
  const consumptionMap = new Map<
    number,
    { length: number; pieceCount: number }
  >()

  // Process pieces with selective edge calculation
  piecesWithEdgeInfo.forEach(({ piece, includeEdges }) => {
    const pieceConsumption = calculateSelectiveEdgeConsumption(piece, includeEdges, edgeBuffer)

    pieceConsumption.forEach((consumption) => {
      const existing = consumptionMap.get(consumption.thickness) || {
        length: 0,
        pieceCount: 0,
      }
      consumptionMap.set(consumption.thickness, {
        length: existing.length + consumption.totalLength,
        pieceCount: existing.pieceCount + piece.quantity,
      })
    })
  })

  // Convert to consumption array
  const consumptionByThickness: EdgeConsumption[] = Array.from(
    consumptionMap.entries(),
  ).map(([thickness, data]) => ({
    thickness,
    totalLength: data.length,
    totalLengthMeters: data.length / 1000,
    pieceCount: data.pieceCount,
  }))

  // Calculate totals
  const totalEdgeLength = consumptionByThickness.reduce(
    (sum, item) => sum + item.totalLength,
    0,
  )
  const totalEdgeLengthMeters = totalEdgeLength / 1000

  return {
    materialName,
    edgeMaterialName,
    consumptionByThickness,
    totalEdgeLength,
    totalEdgeLengthMeters,
  }
}

/**
 * Match edge selection to correct edge variant from availableEdges
 * Considers both edge width and board thickness (isDupel)
 */
export const matchEdgeVariant = (
  edgeWidth: number | null,
  boardThickness: number,
  availableEdges: EdgeMaterial[]
): EdgeMaterial | null => {
  if (!edgeWidth || edgeWidth <= 0) return null

  // Find edge variant that matches both width and board thickness
  const matchedEdge = availableEdges.find(
    edge => edge.edgeWidth === edgeWidth && edge.boardThickness === boardThickness
  )

  return matchedEdge || null
}

/**
 * Calculate edge consumption with correct variant matching
 * Takes into account edge width and board thickness (dupel)
 * Generates notes for placeholder edges
 */
export const calculateEdgeConsumptionWithVariants = (
  pieces: CuttingPiece[],
  materialName: string,
  availableEdges: EdgeMaterial[],
  edgeBuffer: number = 30
): MaterialEdgeConsumption[] => {
  // Group consumption by unique edge variant (width + board thickness)
  const variantConsumptionMap = new Map<
    string, // key: "edgeMaterial.id_width_boardThickness"
    {
      edgeMaterial: EdgeMaterial
      width: number
      boardThickness: number
      totalLength: number
      pieceCount: number
    }
  >()

  pieces.forEach((piece) => {
    const boardThickness = piece.isDupel ? 36 : 18

    // Helper to add edge consumption for one side
    const addEdge = (edgeWidth: number | null, baseLength: number) => {
      if (!edgeWidth || edgeWidth <= 0) return

      // Match to correct edge variant
      const edgeVariant = matchEdgeVariant(edgeWidth, boardThickness, availableEdges)
      if (!edgeVariant) {
        console.warn(`No edge variant found for ${edgeWidth}mm width, ${boardThickness}mm board`)
        return
      }

      const variantKey = `${edgeVariant.id}_${edgeWidth}_${boardThickness}`
      const edgeLengthWithBuffer = (baseLength + edgeBuffer * 2) * piece.quantity

      const existing = variantConsumptionMap.get(variantKey)
      if (existing) {
        existing.totalLength += edgeLengthWithBuffer
        existing.pieceCount += piece.quantity
      } else {
        variantConsumptionMap.set(variantKey, {
          edgeMaterial: edgeVariant,
          width: edgeWidth,
          boardThickness,
          totalLength: edgeLengthWithBuffer,
          pieceCount: piece.quantity
        })
      }
    }

    // Add all four edges
    addEdge(piece.edgeTop, piece.length)
    addEdge(piece.edgeBottom, piece.length)
    addEdge(piece.edgeLeft, piece.width)
    addEdge(piece.edgeRight, piece.width)
  })

  // Convert to MaterialEdgeConsumption array
  const consumptions: MaterialEdgeConsumption[] = []

  variantConsumptionMap.forEach((consumption) => {
    const { edgeMaterial, width, boardThickness, totalLength, pieceCount } = consumption

    const consumptionByVariant: EdgeConsumption[] = [{
      width,
      boardThickness,
      totalLength,
      totalLengthMeters: totalLength / 1000,
      pieceCount
    }]

    // Generate placeholder note if needed
    let placeholderNote: string | undefined
    if (edgeMaterial.isPlaceholder) {
      placeholderNote = `MISSING EDGE: ${materialName} - ${width}mm width for ${boardThickness}mm board (${(totalLength / 1000).toFixed(2)}m needed)`
    }

    consumptions.push({
      materialName,
      edgeMaterialName: edgeMaterial.name,
      edgeMaterial,
      consumptionByVariant,
      totalEdgeLength: totalLength,
      totalEdgeLengthMeters: totalLength / 1000,
      isPlaceholder: edgeMaterial.isPlaceholder,
      placeholderNote
    })
  })

  return consumptions
}

/**
 * Cutting cost calculation constants and functions
 */
export interface CuttingCostConfig {
  baseCuttingCost: number // Base cost per piece in EUR
  complexityCost: number // Additional cost for complex cuts in EUR
  edgingCost: number // Cost per meter of edging in EUR
  rushOrderMultiplier: number // Multiplier for rush orders
}

export const DEFAULT_CUTTING_COSTS: CuttingCostConfig = {
  baseCuttingCost: 0.5, // 50 cents per piece
  complexityCost: 0.25, // 25 cents for pieces with edges
  edgingCost: 1.2, // 1.20 EUR per meter of edge
  rushOrderMultiplier: 1.5, // 50% markup for rush orders
}

export interface CuttingCostBreakdown {
  materialName: string
  piecesCount: number
  baseCuttingCost: number
  complexityCost: number
  edgingCost: number
  edgingLength: number
  totalCost: number
}

/**
 * Calculate cutting costs for a material specification
 */
export const calculateCuttingCosts = (
  pieces: CuttingPiece[],
  materialName: string,
  edgeConsumption: MaterialEdgeConsumption | null,
  config: CuttingCostConfig = DEFAULT_CUTTING_COSTS,
): CuttingCostBreakdown => {
  const totalPieces = pieces.reduce((sum, piece) => sum + piece.quantity, 0)

  // Base cutting cost (per piece)
  const baseCuttingCost = totalPieces * config.baseCuttingCost

  // Complexity cost for pieces with edges
  const piecesWithEdges = pieces
    .filter(
      (piece) =>
        piece.edgeAllAround ||
        piece.edgeTop ||
        piece.edgeBottom ||
        piece.edgeLeft ||
        piece.edgeRight,
    )
    .reduce((sum, piece) => sum + piece.quantity, 0)

  const complexityCost = piecesWithEdges * config.complexityCost

  // Edging cost
  const edgingLength = edgeConsumption?.totalEdgeLengthMeters || 0
  const edgingCost = edgingLength * config.edgingCost

  const totalCost = baseCuttingCost + complexityCost + edgingCost

  return {
    materialName,
    piecesCount: totalPieces,
    baseCuttingCost,
    complexityCost,
    edgingCost,
    edgingLength,
    totalCost,
  }
}
