import { useMemo } from 'react'
import { OptimizedGuillotineCuttingOptimizer } from '../utils/guillotineCutting'
import type { CuttingSpecification, CuttingPiece } from '../types/shopify'
import type { CuttingConfig } from '../main'
import { getEffectiveBoardDimensions, applyDupelTransform } from '../config/cutting'

export interface UnplacedPieceInfo {
  piece: CuttingPiece
  materialName: string
  reason: 'too_big' | 'optimization_failed'
  boardWidth: number
  boardHeight: number
}

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
  unplacedPiecesInfo?: UnplacedPieceInfo[]
}

export const useCuttingLayouts = (
  specifications: CuttingSpecification[],
  cuttingConfig?: CuttingConfig
) => {
  const cuttingLayouts = useMemo(() => {
    const allLayouts: CuttingLayoutData[] = []
    const sawWidth = cuttingConfig?.sawWidth || 2 // Default to 2mm if not provided

    specifications.forEach((specification, specIndex) => {
      if (specification.pieces.length === 0) {
        return
      }

      // Use default dimensions if not provided (standard DTD board size)
      const rawDimensions = specification.material.dimensions || {
        width: 2800,   // Standard DTD board width
        height: 2070,  // Standard DTD board height
        thickness: 18  // Standard thickness
      }

      // Apply board trimming (osamovanie) - 15mm from each side
      const effectiveDimensions = getEffectiveBoardDimensions(
        rawDimensions.width,
        rawDimensions.height
      )

      // Apply Dupel transformation to pieces (if isDupel checked)
      const transformedPieces: CuttingPiece[] = specification.pieces.map(piece => {
        if (piece.isDupel) {
          const dupelTransform = applyDupelTransform(
            piece.length,
            piece.width,
            piece.quantity
          )
          return {
            ...piece,
            length: dupelTransform.length,
            width: dupelTransform.width,
            quantity: dupelTransform.quantity,
          }
        }
        return piece
      })

      const optimizer = new OptimizedGuillotineCuttingOptimizer(
        effectiveDimensions.width,
        effectiveDimensions.height,
        sawWidth
      )

      // Use multi-board optimization with rotation setting
      const multiboardResult = optimizer.optimizeMultipleBoards(transformedPieces)

      // Analyze unplaced pieces to determine why they couldn't be placed
      const unplacedPiecesInfo: UnplacedPieceInfo[] = multiboardResult.unplacedPieces.map(piece => {
        // Check if piece is too big for the board (even with rotation)
        const fitsNormally = piece.length <= effectiveDimensions.width && piece.width <= effectiveDimensions.height
        const fitsRotated = piece.width <= effectiveDimensions.width && piece.length <= effectiveDimensions.height
        const isTooLarge = !fitsNormally && !fitsRotated

        return {
          piece,
          materialName: specification.material.title,
          reason: isTooLarge ? 'too_big' : 'optimization_failed',
          boardWidth: effectiveDimensions.width,
          boardHeight: effectiveDimensions.height
        }
      })

      // Add each board as a separate layout
      multiboardResult.boards.forEach((board, boardIndex) => {
        allLayouts.push({
          materialIndex: specIndex + 1,
          boardNumber: boardIndex + 1,
          materialName: specification.material.title,
          layout: board,
          isMultiBoard: multiboardResult.totalBoards > 1,
          totalBoards: multiboardResult.totalBoards,
          multiboardStats: {
            totalPieces: multiboardResult.totalPieces,
            totalPlacedPieces: multiboardResult.totalPlacedPieces,
            totalUnplacedPieces: multiboardResult.totalUnplacedPieces,
            overallEfficiency: multiboardResult.overallEfficiency
          },
          unplacedPiecesInfo: boardIndex === 0 ? unplacedPiecesInfo : undefined
        })
      })

      // Log unplaced pieces warning if any
      if (multiboardResult.unplacedPieces.length > 0) {
        console.warn(`Material ${specIndex + 1}: ${multiboardResult.totalUnplacedPieces} pieces could not be placed`, multiboardResult.unplacedPieces)
      }
    })
    
    return allLayouts
  }, [specifications, cuttingConfig])

  const overallStats = useMemo(() => {
    const stats = cuttingLayouts.reduce(
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

          // Collect unplaced pieces info
          if (layoutData.unplacedPiecesInfo && layoutData.unplacedPiecesInfo.length > 0) {
            acc.unplacedPiecesInfo.push(...layoutData.unplacedPiecesInfo)
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
        totalUnplacedPieces: 0,
        unplacedPiecesInfo: [] as UnplacedPieceInfo[]
      }
    )

    return stats
  }, [cuttingLayouts])

  if (overallStats.totalBoards > 0) {
    overallStats.averageEfficiency /= overallStats.totalBoards
  }

  return {
    cuttingLayouts,
    overallStats
  }
}