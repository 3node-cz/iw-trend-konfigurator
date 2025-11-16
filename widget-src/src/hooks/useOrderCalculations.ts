import { useMemo } from 'react'
import type { CuttingSpecification } from '../types/shopify'
import type { CuttingLayoutData } from './useCuttingLayouts'
import {
  calculateMaterialEdgeConsumption,
  calculateMaterialEdgeConsumptionWithMixedEdges,
  calculateEdgeConsumptionWithVariants,
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
    // Log configuration values being used in calculations
    console.log('💰 [Order Calculations] Using configuration:');
    console.log('   Edge Buffer:', edgeBuffer, 'mm');
    console.log('   Cutting Costs:', cuttingCostConfig);
    console.log('   Processing', specifications.length, 'material specifications');

    const edgeConsumption: MaterialEdgeConsumption[] = []
    const cuttingCosts: CuttingCostBreakdown[] = []

    // Process each material specification
    specifications.forEach(spec => {
      // Calculate edge consumption
      const materialEdgeConsumptions: MaterialEdgeConsumption[] = []

      if (spec.pieces.length > 0) {
        const materialName = spec.material?.title || spec.material?.name || 'Unknown Material'

        // NEW: If availableEdges exist, use variant-based calculation
        if (spec.availableEdges && spec.availableEdges.length > 0) {
          // Use new variant-based edge calculation that handles width + board thickness
          const variantConsumptions = calculateEdgeConsumptionWithVariants(
            spec.pieces,
            materialName,
            spec.availableEdges,
            edgeBuffer
          )

          variantConsumptions.forEach(consumption => {
            materialEdgeConsumptions.push(consumption)
            edgeConsumption.push(consumption)
          })
        } else {
          // FALLBACK: Use old logic for backwards compatibility
          // Group edges by their edge materials (handling mixed edge materials per piece)
          const edgeMaterialGroups = new Map<string, {
            edgeMaterial: { id: string; name: string };
            piecesWithEdges: Array<{
              piece: typeof spec.pieces[0];
              includeEdges: {
                top?: boolean;
                bottom?: boolean;
                left?: boolean;
                right?: boolean;
              }
            }>
          }>()

          spec.pieces.forEach(piece => {
            const hasEdges = piece.edgeAllAround || piece.edgeTop || piece.edgeBottom ||
              piece.edgeLeft || piece.edgeRight

            if (!hasEdges) return

            // Map each edge to its edge material
            const edgeToMaterial: Array<{
              edgeName: 'top' | 'bottom' | 'left' | 'right';
              hasEdge: boolean;
              material: typeof spec.edgeMaterial | null;
            }> = [
              {
                edgeName: 'top',
                hasEdge: !!piece.edgeTop,
                material: piece.customEdgeTop || (piece.edgeTop ? spec.edgeMaterial : null)
              },
              {
                edgeName: 'bottom',
                hasEdge: !!piece.edgeBottom,
                material: piece.customEdgeBottom || (piece.edgeBottom ? spec.edgeMaterial : null)
              },
              {
                edgeName: 'left',
                hasEdge: !!piece.edgeLeft,
                material: piece.customEdgeLeft || (piece.edgeLeft ? spec.edgeMaterial : null)
              },
              {
                edgeName: 'right',
                hasEdge: !!piece.edgeRight,
                material: piece.customEdgeRight || (piece.edgeRight ? spec.edgeMaterial : null)
              }
            ]

            // Group edges by their edge material
            const edgesByMaterial = new Map<string, {
              material: typeof spec.edgeMaterial;
              edges: Array<'top' | 'bottom' | 'left' | 'right'>
            }>()

            edgeToMaterial.forEach(({ edgeName, hasEdge, material }) => {
              if (hasEdge && material) {
                const key = material.id
                if (!edgesByMaterial.has(key)) {
                  edgesByMaterial.set(key, {
                    material,
                    edges: []
                  })
                }
                edgesByMaterial.get(key)!.edges.push(edgeName)
              }
            })

            // Add piece to each edge material group with only the edges that use that material
            edgesByMaterial.forEach((value, materialId) => {
              const { material, edges } = value

              if (!edgeMaterialGroups.has(materialId)) {
                edgeMaterialGroups.set(materialId, {
                  edgeMaterial: { id: material.id, name: material.name },
                  piecesWithEdges: []
                })
              }

              edgeMaterialGroups.get(materialId)!.piecesWithEdges.push({
                piece,
                includeEdges: {
                  top: edges.includes('top'),
                  bottom: edges.includes('bottom'),
                  left: edges.includes('left'),
                  right: edges.includes('right')
                }
              })
            })
          })

          // Calculate consumption for each edge material group
          edgeMaterialGroups.forEach(group => {
            const consumption = calculateMaterialEdgeConsumptionWithMixedEdges(
              group.piecesWithEdges,
              materialName,
              group.edgeMaterial.name,
              edgeBuffer
            )
            materialEdgeConsumptions.push(consumption)
            edgeConsumption.push(consumption)
          })
        }
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