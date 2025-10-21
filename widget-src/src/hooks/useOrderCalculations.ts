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
  cuttingCostConfig: CuttingCostConfig = DEFAULT_CUTTING_COSTS
): OrderCalculations => {
  
  const calculations = useMemo(() => {
    const edgeConsumption: MaterialEdgeConsumption[] = []
    const cuttingCosts: CuttingCostBreakdown[] = []
    
    // Process each material specification
    specifications.forEach(spec => {
      // Calculate edge consumption if edge material is selected
      let materialEdgeConsumption: MaterialEdgeConsumption | null = null

      if (spec.edgeMaterial && spec.pieces.length > 0) {
        // Only calculate for pieces that actually use edges
        const piecesWithEdges = spec.pieces.filter(piece =>
          piece.edgeAllAround || piece.edgeTop || piece.edgeBottom ||
          piece.edgeLeft || piece.edgeRight
        )

        if (piecesWithEdges.length > 0) {
          materialEdgeConsumption = calculateMaterialEdgeConsumption(
            piecesWithEdges,
            spec.material?.title || spec.material?.name || 'Unknown Material',
            spec.edgeMaterial.name
          )
          edgeConsumption.push(materialEdgeConsumption)
        }
      }

      // Calculate cutting costs for this material
      if (spec.pieces.length > 0) {
        const materialCuttingCost = calculateCuttingCosts(
          spec.pieces,
          spec.material?.title || spec.material?.name || 'Unknown Material',
          materialEdgeConsumption,
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
  }, [specifications, cuttingLayouts, cuttingCostConfig])
  
  return calculations
}