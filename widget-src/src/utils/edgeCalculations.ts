import type { CuttingPiece } from '../types/shopify'

export interface EdgeConsumption {
  thickness: number // Edge thickness in mm
  totalLength: number // Total length needed in mm
  totalLengthMeters: number // Total length needed in meters
  pieceCount: number // Number of pieces using this thickness
}

export interface MaterialEdgeConsumption {
  materialName: string
  edgeMaterialName: string
  consumptionByThickness: EdgeConsumption[]
  totalEdgeLength: number // Total across all thicknesses in mm
  totalEdgeLengthMeters: number // Total across all thicknesses in meters
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
