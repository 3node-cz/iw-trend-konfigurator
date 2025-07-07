/**
 * Four-Layer Cutting State Architecture
 *
 * Layer 1: Dimensional Data (BasicDimensionalPart)
 * - Core cutting dimensions: width, height, quantity, orientation, label, blockId
 * - Changes trigger block preparation and layout optimization
 *
 * Layer 2: Block Preparation (PreparedPiece)
 * - Converts dimensional parts into pieces ready for board placement
 * - Handles block grouping and composite block creation
 * - Creates individual pieces for non-blocked parts
 * - Creates composite blocks for blocked parts (horizontal arrangement)
 *
 * Layer 3: Board Placement (BoardPlacementState)
 * - Takes prepared pieces and places them on boards using BLF algorithm
 * - Handles both individual pieces and composite block pieces
 * - Provides board layout optimization and efficiency calculations
 *
 * Layer 4: Visual Enhancements (VisualEnhancements)
 * - UI-only properties: corners, edges, L-shapes
 * - Independent of cutting calculations
 * - Immediate visual feedback
 */

import { useState, useCallback, useMemo } from 'react'
import type {
  SheetLayout,
  CornerModification,
  LShapeConfig,
  EdgeTreatment,
} from '../../types/simple'
import type { EdgeValue } from '../../utils/edgeConstants'
import { useBlockPreparation, type PreparedPiece } from './useBlockPreparation'
import { useBoardPlacement } from './useBoardPlacement'
import { useDebounceValue } from './useDebounceValue'
import {
  hasCornerModifications,
  hasEdgeTreatmentsInterface,
  isLShape,
  hasAdvancedConfigInterface,
} from '../../utils/partEnhancements'

// Layer 1: Core dimensional data for cutting optimization
export interface BasicDimensionalPart {
  id: string
  width: number
  height: number
  quantity: number
  label?: string
  orientation?: 'fixed' | 'rotatable'
  blockId?: number // block number for texture continuity (1, 2, 3...). If undefined, part is individual
}

// Layer 2: Block preparation properties
export interface BlockPreparationLayer {
  preparedPieces: PreparedPiece[]
  blockCount: number
  individualPieceCount: number
  compositeBlockCount: number
}

// Layer 3: Board placement properties
export interface BoardPlacementLayer {
  boardLayout: SheetLayout | null
  isCalculating: boolean
  totalBoards: number
  overallEfficiency: number
}

// Layer 4: Visual enhancement properties
export interface VisualEnhancements {
  corners?: {
    topLeft: CornerModification
    topRight: CornerModification
    bottomRight: CornerModification
    bottomLeft: CornerModification
  }
  edges?: EdgeTreatment
  lShape?: LShapeConfig
}

// Combined part with all layers for UI display
export type EnhancedCuttingPart = BasicDimensionalPart &
  VisualEnhancements & {
    // Computed properties for UI indicators
    hasCornerModifications?: boolean
    hasEdgeTreatments?: boolean
    isLShape?: boolean
    hasAdvancedConfig?: boolean
  }

export interface LayeredCuttingStateAPI {
  // Layer 1: Dimensional data operations
  basicParts: BasicDimensionalPart[]
  addDimensionalPart: (partData: Omit<BasicDimensionalPart, 'id'>) => void
  updateDimensionalPart: (
    id: string,
    updates: Partial<BasicDimensionalPart>,
  ) => void
  removeDimensionalPart: (id: string) => void
  clearAllParts: () => void

  // Layer 2: Block preparation (read-only, auto-calculated)
  blockPreparation: BlockPreparationLayer

  // Layer 3: Board placement (read-only, auto-calculated)
  boardPlacement: BoardPlacementLayer

  // Layer 4: Visual enhancement operations
  updateVisualEnhancements: (
    id: string,
    updates: Partial<VisualEnhancements>,
  ) => void
  updatePartEdge: (id: string, edgeIndex: number, edgeValue: EdgeValue) => void
  updatePartCorner: (
    id: string,
    cornerIndex: number,
    corner: CornerModification,
  ) => void
  updatePartLShape: (id: string, lShapeUpdates: Partial<LShapeConfig>) => void

  // Enhanced data for UI
  enhancedParts: EnhancedCuttingPart[]
  getEnhancedPartById: (id: string) => EnhancedCuttingPart | null

  // Optimized selectors for performance
  getDimensionalPartsOnly: () => BasicDimensionalPart[]
  getBlockPreparationOnly: () => BlockPreparationLayer
  getBoardPlacementOnly: () => BoardPlacementLayer
  getVisualEnhancementsOnly: () => Record<string, VisualEnhancements>

  // Summary calculations
  totalCuttingArea: number
  totalPartCount: number

  // Backward compatibility (deprecated, will be removed)
  /** @deprecated Use boardPlacement.boardLayout instead */
  optimizedLayout: {
    sheetLayout: SheetLayout | null
    isCalculating: boolean
  }
}

export const useLayeredCuttingState = (): LayeredCuttingStateAPI => {
  // Layer 1: Core dimensional parts
  const [dimensionalParts, setDimensionalParts] = useState<
    BasicDimensionalPart[]
  >([])

  // Layer 4: Visual enhancements (independent of layout)
  const [visualEnhancements, setVisualEnhancements] = useState<
    Record<string, VisualEnhancements>
  >({})

  // Debounce dimensional changes to avoid excessive recalculations
  const debouncedDimensionalParts = useDebounceValue(dimensionalParts, 300)

  // Layer 2: Block preparation from dimensional parts
  const blockPreparation = useBlockPreparation(debouncedDimensionalParts)

  // Layer 3: Board placement from prepared pieces
  const boardPlacement = useBoardPlacement(blockPreparation.preparedPieces)

  // Backward compatibility for existing UI components
  const optimizedLayout = useMemo(
    () => ({
      sheetLayout: boardPlacement.boardLayout,
      isCalculating: boardPlacement.isCalculating,
    }),
    [boardPlacement.boardLayout, boardPlacement.isCalculating],
  )

  // Combined enhanced parts for UI display
  const enhancedParts = useMemo((): EnhancedCuttingPart[] => {
    return dimensionalParts.map((dimensionalPart) => {
      const enhancements = visualEnhancements[dimensionalPart.id] || {}

      // Compute indicator flags using utility functions
      const cornerModifications = hasCornerModifications(enhancements.corners)
      const edgeTreatments = hasEdgeTreatmentsInterface(enhancements.edges)
      const lShapeEnabled = isLShape(enhancements.lShape)
      const advancedConfig = hasAdvancedConfigInterface(enhancements.corners, enhancements.edges, enhancements.lShape)

      return {
        ...dimensionalPart,
        ...enhancements,
        hasCornerModifications: cornerModifications,
        hasEdgeTreatments: edgeTreatments,
        isLShape: lShapeEnabled,
        hasAdvancedConfig: advancedConfig,
      } as EnhancedCuttingPart
    })
  }, [dimensionalParts, visualEnhancements])

  // Layer 1 operations (affect layout optimization)
  const addDimensionalPart = useCallback(
    (partData: Omit<BasicDimensionalPart, 'id'>) => {
      const newPart: BasicDimensionalPart = {
        ...partData,
        id: `part-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }
      setDimensionalParts((prev) => [...prev, newPart])
    },
    [],
  )

  const updateDimensionalPart = useCallback(
    (id: string, updates: Partial<BasicDimensionalPart>) => {
      setDimensionalParts((prev) =>
        prev.map((part) => (part.id === id ? { ...part, ...updates } : part)),
      )
    },
    [],
  )

  const removeDimensionalPart = useCallback((id: string) => {
    setDimensionalParts((prev) => prev.filter((part) => part.id !== id))
    setVisualEnhancements((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _, ...remaining } = prev
      return remaining
    })
  }, [])

  const clearAllParts = useCallback(() => {
    setDimensionalParts([])
    setVisualEnhancements({})
  }, [])

  // Layer 3 operations (visual only, no layout impact)
  const updateVisualEnhancements = useCallback(
    (id: string, updates: Partial<VisualEnhancements>) => {
      setVisualEnhancements((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          ...updates,
        },
      }))
    },
    [],
  )

  const updatePartEdge = useCallback(
    (id: string, edgeIndex: number, edgeValue: EdgeValue) => {
      setVisualEnhancements((prev) => {
        const currentEdges = prev[id]?.edges || {
          top: 'none',
          right: 'none',
          bottom: 'none',
          left: 'none',
        }
        const edgeKeys = ['top', 'right', 'bottom', 'left'] as const
        const edgeKey = edgeKeys[edgeIndex]

        return {
          ...prev,
          [id]: {
            ...prev[id],
            edges: {
              ...currentEdges,
              [edgeKey]: edgeValue,
            },
          },
        }
      })
    },
    [],
  )

  const updatePartCorner = useCallback(
    (id: string, cornerIndex: number, corner: CornerModification) => {
      setVisualEnhancements((prev) => {
        const currentCorners = prev[id]?.corners || {
          topLeft: { type: 'none' },
          topRight: { type: 'none' },
          bottomRight: { type: 'none' },
          bottomLeft: { type: 'none' },
        }
        const cornerKeys = [
          'topLeft',
          'topRight',
          'bottomRight',
          'bottomLeft',
        ] as const
        const cornerKey = cornerKeys[cornerIndex]

        return {
          ...prev,
          [id]: {
            ...prev[id],
            corners: {
              ...currentCorners,
              [cornerKey]: corner,
            },
          },
        }
      })
    },
    [],
  )

  const updatePartLShape = useCallback(
    (id: string, lShapeUpdates: Partial<LShapeConfig>) => {
      setVisualEnhancements((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          lShape: {
            enabled: false,
            ...prev[id]?.lShape,
            ...lShapeUpdates,
          },
        },
      }))
    },
    [],
  )

  // Optimized selectors for selective re-rendering
  const getDimensionalPartsOnly = useCallback(
    () => dimensionalParts,
    [dimensionalParts],
  )

  const getVisualEnhancementsOnly = useCallback(
    () => visualEnhancements,
    [visualEnhancements],
  )

  const getEnhancedPartById = useCallback(
    (id: string): EnhancedCuttingPart | null => {
      const dimensionalPart = dimensionalParts.find((p) => p.id === id)
      if (!dimensionalPart) return null

      const enhancements = visualEnhancements[id] || {}

      // Compute indicator flags
      const hasCornerModifications =
        enhancements.corners &&
        Object.values(enhancements.corners).some((corner) => corner !== null)

      const hasEdgeTreatments =
        enhancements.edges &&
        Object.values(enhancements.edges).some((edge) => edge !== 'none')

      const isLShape = enhancements.lShape?.enabled === true

      const hasAdvancedConfig =
        hasCornerModifications || hasEdgeTreatments || isLShape

      return {
        ...dimensionalPart,
        ...enhancements,
        hasCornerModifications,
        hasEdgeTreatments,
        isLShape,
        hasAdvancedConfig,
      } as EnhancedCuttingPart
    },
    [dimensionalParts, visualEnhancements],
  )

  // Summary calculations (based on Layer 1 only)
  const totalCuttingArea = useMemo(() => {
    return dimensionalParts.reduce(
      (sum, part) => sum + part.width * part.height * part.quantity,
      0,
    )
  }, [dimensionalParts])

  const totalPartCount = useMemo(() => {
    const total = dimensionalParts.reduce((sum, part) => {
      console.log(`Part ${part.id}: quantity=${part.quantity} (type: ${typeof part.quantity})`)
      return sum + Number(part.quantity)
    }, 0)
    console.log(`Total part count: ${total}`)
    return total
  }, [dimensionalParts])

  return {
    // Layer 1: Dimensional data
    basicParts: dimensionalParts,
    addDimensionalPart,
    updateDimensionalPart,
    removeDimensionalPart,
    clearAllParts,

    // Layer 2: Block preparation
    blockPreparation,

    // Layer 3: Board placement
    boardPlacement,

    // Layer 4: Visual enhancements
    updateVisualEnhancements,
    updatePartEdge,
    updatePartCorner,
    updatePartLShape,

    // Enhanced data for UI
    enhancedParts,
    getEnhancedPartById,

    // Optimized selectors
    getDimensionalPartsOnly,
    getBlockPreparationOnly: () => blockPreparation,
    getBoardPlacementOnly: () => boardPlacement,
    getVisualEnhancementsOnly,

    // Summary calculations
    totalCuttingArea,
    totalPartCount,

    // Backward compatibility (deprecated)
    optimizedLayout,
  }
}
