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
 */
export const calculatePieceEdgeConsumption = (
  piece: CuttingPiece,
): EdgeConsumption[] => {
  const consumptionMap = new Map<number, number>()

  // Calculate perimeter for each edge thickness
  const addEdgeLength = (thickness: number | null, length: number) => {
    if (thickness && thickness > 0) {
      const current = consumptionMap.get(thickness) || 0
      consumptionMap.set(thickness, current + length)
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
 * Calculate total edge consumption for all pieces using the same edge material
 */
export const calculateMaterialEdgeConsumption = (
  pieces: CuttingPiece[],
  materialName: string,
  edgeMaterialName: string,
): MaterialEdgeConsumption => {
  const consumptionMap = new Map<
    number,
    { length: number; pieceCount: number }
  >()

  // Process all pieces
  pieces.forEach((piece) => {
    const pieceConsumption = calculatePieceEdgeConsumption(piece)

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
