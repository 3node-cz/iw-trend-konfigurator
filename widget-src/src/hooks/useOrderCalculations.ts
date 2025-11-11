import { useMemo } from 'react'
import type { CuttingSpecification } from '../types/shopify'
import type { CuttingLayoutData } from './useCuttingLayouts'
import { 
  calculateMaterialEdgeConsumption, 
  calculateCuttingCosts,
  DEFAULT_CUTTING_COSTS,
  type MaterialEdgeConsumption,
  type CuttingCostBreakdown,
  type CuttingCostConfig
} from '../utils/edgeCalculations'

export interface OrderCalculations {
  edgeConsumption: MaterialEdgeConsumption[]
  cuttingCosts: CuttingCostBreakdown[]
  totals: {
    totalEdgeLength: number // Total edge length in meters across all materials
    totalCuttingCost: number // Total cutting cost in EUR
    totalPieces: number // Total number of pieces
    totalMaterials: number // Number of different materials
    totalCuts: number // Total number of actual cuts needed
  }
}

export const useOrderCalculations = (
  specifications: CuttingSpecification[],
  cuttingLayouts: CuttingLayoutData[] = [],
  cuttingCostConfig: CuttingCostConfig = DEFAULT_CUTTING_COSTS,
  edgeBuffer: number = 30
): OrderCalculations => {

  const calculations = useMemo(() => {
    const edgeConsumption: MaterialEdgeConsumption[] = []
    const cuttingCosts: CuttingCostBreakdown[] = []

    // Process each material specification
    specifications.forEach(spec => {
      // Calculate edge consumption - now handling multiple edge materials per spec
      const materialEdgeConsumptions: MaterialEdgeConsumption[] = []

      if (spec.pieces.length > 0) {
        // Group pieces by their edge materials (considering custom edges)
        const edgeMaterialGroups = new Map<string, {
          edgeMaterial: { id: string; name: string };
          pieces: typeof spec.pieces
        }>()

        spec.pieces.forEach(piece => {
          const hasEdges = piece.edgeAllAround || piece.edgeTop || piece.edgeBottom ||
            piece.edgeLeft || piece.edgeRight

          if (!hasEdges) return

          // Collect all unique edge materials used in this piece
          const pieceEdgeMaterials = new Set<string>()

          // Check each edge for custom material
          if (piece.edgeTop && piece.customEdgeTop) {
            pieceEdgeMaterials.add(piece.customEdgeTop.id)
          } else if (piece.edgeTop && spec.edgeMaterial) {
            pieceEdgeMaterials.add(spec.edgeMaterial.id)
          }

          if (piece.edgeBottom && piece.customEdgeBottom) {
            pieceEdgeMaterials.add(piece.customEdgeBottom.id)
          } else if (piece.edgeBottom && spec.edgeMaterial) {
            pieceEdgeMaterials.add(spec.edgeMaterial.id)
          }

          if (piece.edgeLeft && piece.customEdgeLeft) {
            pieceEdgeMaterials.add(piece.customEdgeLeft.id)
          } else if (piece.edgeLeft && spec.edgeMaterial) {
            pieceEdgeMaterials.add(spec.edgeMaterial.id)
          }

          if (piece.edgeRight && piece.customEdgeRight) {
            pieceEdgeMaterials.add(piece.customEdgeRight.id)
          } else if (piece.edgeRight && spec.edgeMaterial) {
            pieceEdgeMaterials.add(spec.edgeMaterial.id)
          }

          // For simplicity, use the first edge material found
          // (pieces with mixed edge materials are complex and rare)
          const edgeMaterialId = Array.from(pieceEdgeMaterials)[0]
          if (!edgeMaterialId) return

          // Determine the edge material object
          const edgeMaterial =
            piece.customEdgeTop || piece.customEdgeBottom ||
            piece.customEdgeLeft || piece.customEdgeRight ||
            spec.edgeMaterial

          if (!edgeMaterial) return

          const key = edgeMaterialId
          if (!edgeMaterialGroups.has(key)) {
            edgeMaterialGroups.set(key, {
              edgeMaterial: { id: edgeMaterial.id, name: edgeMaterial.name },
              pieces: []
            })
          }
          edgeMaterialGroups.get(key)!.pieces.push(piece)
        })

        // Calculate consumption for each edge material group
        edgeMaterialGroups.forEach(group => {
          const consumption = calculateMaterialEdgeConsumption(
            group.pieces,
            spec.material?.title || spec.material?.name || 'Unknown Material',
            group.edgeMaterial.name,
            edgeBuffer
          )
          materialEdgeConsumptions.push(consumption)
          edgeConsumption.push(consumption)
        })
      }

      // Calculate cutting costs for this material
      // Use first edge consumption or null if none
      if (spec.pieces.length > 0) {
        const materialCuttingCost = calculateCuttingCosts(
          spec.pieces,
          spec.material?.title || spec.material?.name || 'Unknown Material',
          materialEdgeConsumptions[0] || null,
          cuttingCostConfig
        )
        cuttingCosts.push(materialCuttingCost)
      }
    })
    
    // Calculate totals
    const totalEdgeLength = edgeConsumption.reduce(
      (sum, consumption) => sum + consumption.totalEdgeLengthMeters, 0
    )
    
    const totalCuttingCost = cuttingCosts.reduce(
      (sum, cost) => sum + cost.totalCost, 0
    )
    
    const totalPieces = specifications.reduce(
      (sum, spec) => sum + spec.pieces.reduce((pieceSum, piece) => pieceSum + piece.quantity, 0), 0
    )
    
    const totalMaterials = specifications.length
    
    // Calculate total cuts from cutting layouts
    const totalCuts = cuttingLayouts.reduce(
      (sum, layout) => sum + (layout.layout.cutLines?.length || 0), 0
    )
    
    
    return {
      edgeConsumption,
      cuttingCosts,
      totals: {
        totalEdgeLength,
        totalCuttingCost,
        totalPieces,
        totalMaterials,
        totalCuts
      }
    }
  }, [specifications, cuttingLayouts, cuttingCostConfig, edgeBuffer])

  return calculations
}