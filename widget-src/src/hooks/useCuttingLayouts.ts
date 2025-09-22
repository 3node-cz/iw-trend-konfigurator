import { useMemo } from 'react'
import { OptimizedGuillotineCuttingOptimizer } from '../utils/guillotineCutting'
import type { CuttingSpecification } from '../types/shopify'

export interface CuttingLayoutData {
  materialIndex: number
  boardNumber: number
  materialName: string
  layout: any
  isMultiBoard: boolean
  totalBoards: number
  multiboardStats: {
    totalPieces: number
    totalPlacedPieces: number
    totalUnplacedPieces: number
    overallEfficiency: number
  }
}

export const useCuttingLayouts = (specifications: CuttingSpecification[]) => {
  const cuttingLayouts = useMemo(() => {
    const allLayouts: CuttingLayoutData[] = []
    
    specifications.forEach((specification, specIndex) => {
      if (specification.pieces.length === 0) {
        return
      }

      // Use default dimensions if not provided (standard DTD board size)
      const dimensions = specification.material.dimensions || {
        width: 2800,   // Standard DTD board width
        height: 2070,  // Standard DTD board height
        thickness: 18  // Standard thickness
      }

      const optimizer = new OptimizedGuillotineCuttingOptimizer(
        dimensions.width,
        dimensions.height
      )
      
      // Use multi-board optimization with rotation setting
      const multiboardResult = optimizer.optimizeMultipleBoards(specification.pieces)
      
      // Add each board as a separate layout
      multiboardResult.boards.forEach((board, boardIndex) => {
        allLayouts.push({
          materialIndex: specIndex + 1,
          boardNumber: boardIndex + 1,
          materialName: specification.material.name,
          layout: board,
          isMultiBoard: multiboardResult.totalBoards > 1,
          totalBoards: multiboardResult.totalBoards,
          multiboardStats: {
            totalPieces: multiboardResult.totalPieces,
            totalPlacedPieces: multiboardResult.totalPlacedPieces,
            totalUnplacedPieces: multiboardResult.totalUnplacedPieces,
            overallEfficiency: multiboardResult.overallEfficiency
          }
        })
      })
      
      // Log unplaced pieces warning if any
      if (multiboardResult.unplacedPieces.length > 0) {
        console.warn(`Material ${specIndex + 1}: ${multiboardResult.totalUnplacedPieces} pieces could not be placed`, multiboardResult.unplacedPieces)
      }
    })
    
    return allLayouts
  }, [specifications])

  const overallStats = useMemo(() => {
    return cuttingLayouts.reduce(
      (acc, layoutData) => {
        if (layoutData) {
          acc.totalBoards += 1
          acc.averageEfficiency += layoutData.layout.efficiency
          acc.totalWasteArea += layoutData.layout.totalWasteArea
          acc.totalCuts += layoutData.layout.cutLines?.length || 0
          
          // Track multi-board specific stats
          if (layoutData.isMultiBoard && layoutData.boardNumber === 1) {
            acc.totalMultiboardPieces += layoutData.multiboardStats.totalPieces
            acc.totalUnplacedPieces += layoutData.multiboardStats.totalUnplacedPieces
          }
        }
        return acc
      },
      { 
        totalBoards: 0, 
        averageEfficiency: 0, 
        totalWasteArea: 0,
        totalCuts: 0,
        totalMultiboardPieces: 0,
        totalUnplacedPieces: 0
      }
    )
  }, [cuttingLayouts])

  if (overallStats.totalBoards > 0) {
    overallStats.averageEfficiency /= overallStats.totalBoards
  }

  return {
    cuttingLayouts,
    overallStats
  }
}