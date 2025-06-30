/**
 * Three-Layer Cutting State Architecture
 *
 * Layer 1: Dimensional Data (BasicDimensionalPart)
 * - Core cutting dimensions: width, height, quantity, orientation, label
 * - Changes trigger layout optimization
 *
 * Layer 2: Layout Optimization (OptimizedLayout)
 * - Auto-calculated cutting layout from Layer 1
 * - Debounced and cached for performance
 * - Includes loading states for expensive calculations
 *
 * Layer 3: Visual Enhancements (VisualEnhancements)
 * - UI-only properties: corners, edges, L-shapes
 * - Independent of cutting calculations
 * - Immediate visual feedback
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import type {
  Part,
  SheetLayout,
  CornerModification,
  LShapeConfig,
  EdgeTreatment,
} from '../../types/simple'
import type { EdgeValue } from '../../utils/edgeConstants'
import {
  optimizeCuttingBLF,
  defaultCuttingConfig,
  silentLogger,
  type CuttingConfig,
} from '../../utils/cuttingOptimizer'
import { useDebounceValue } from './useDebounceValue'

// Layer 1: Core dimensional data for cutting optimization
export interface BasicDimensionalPart {
  id: string
  width: number
  height: number
  quantity: number
  label?: string
  orientation?: 'fixed' | 'rotatable'
}

// Layer 2: Optimized layout calculation results
export interface OptimizedLayout {
  sheetLayout: SheetLayout | null
  cuttingConfig: CuttingConfig
  isCalculating: boolean
}

// Layer 3: Visual enhancement properties
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

  // Layer 2: Layout optimization (read-only, auto-calculated)
  optimizedLayout: OptimizedLayout

  // Layer 3: Visual enhancement operations
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
  getLayoutDataOnly: () => OptimizedLayout
  getVisualEnhancementsOnly: () => Record<string, VisualEnhancements>

  // Summary calculations
  totalCuttingArea: number
  totalPartCount: number
}

export const useLayeredCuttingState = (): LayeredCuttingStateAPI => {
  // Layer 1: Core dimensional parts (triggers layout recalculation)
  const [dimensionalParts, setDimensionalParts] = useState<
    BasicDimensionalPart[]
  >([])

  // Layer 3: Visual enhancements (independent of layout)
  const [visualEnhancements, setVisualEnhancements] = useState<
    Record<string, VisualEnhancements>
  >({})

  // Loading state for expensive layout calculations
  const [isLayoutCalculating, setIsLayoutCalculating] = useState(false)

  // Debounce dimensional changes to avoid excessive recalculations
  const debouncedDimensionalParts = useDebounceValue(dimensionalParts, 300)

  const logger = useMemo(() => silentLogger, [])
  const cuttingConfig = useMemo(
    () => ({
      ...defaultCuttingConfig,
      sheetWidth: 2800,
      sheetHeight: 2070,
    }),
    [],
  )

  // Layer 2: Auto-calculated layout optimization from Layer 1
  const sheetLayout = useMemo((): SheetLayout | null => {
    if (debouncedDimensionalParts.length === 0) {
      setIsLayoutCalculating(false)
      return null
    }

    setIsLayoutCalculating(true)

    try {
      // Convert dimensional parts to optimizer format
      const partsForOptimization = debouncedDimensionalParts.map((part) => ({
        id: part.id,
        width: part.width,
        height: part.height,
        quantity: part.quantity,
        orientation: part.orientation || 'rotatable',
        label: part.label,
      })) as Part[]

      const result = optimizeCuttingBLF(
        partsForOptimization,
        cuttingConfig,
        logger,
      )
      setIsLayoutCalculating(false)
      return result
    } catch (error) {
      console.error('Layout optimization failed:', error)
      setIsLayoutCalculating(false)
      return null
    }
  }, [debouncedDimensionalParts, cuttingConfig, logger])

  // Track when dimensional parts change vs debounced parts for loading state
  useEffect(() => {
    if (
      dimensionalParts !== debouncedDimensionalParts &&
      dimensionalParts.length > 0
    ) {
      setIsLayoutCalculating(true)
    }
  }, [dimensionalParts, debouncedDimensionalParts])

  // Combined enhanced parts for UI display
  const enhancedParts = useMemo((): EnhancedCuttingPart[] => {
    return dimensionalParts.map((dimensionalPart) => {
      const enhancements = visualEnhancements[dimensionalPart.id] || {}

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

  const getLayoutDataOnly = useCallback(
    (): OptimizedLayout => ({
      sheetLayout,
      cuttingConfig,
      isCalculating: isLayoutCalculating,
    }),
    [sheetLayout, cuttingConfig, isLayoutCalculating],
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
    return dimensionalParts.reduce((sum, part) => sum + part.quantity, 0)
  }, [dimensionalParts])

  return {
    // Layer 1: Dimensional data
    basicParts: dimensionalParts,
    addDimensionalPart,
    updateDimensionalPart,
    removeDimensionalPart,
    clearAllParts,

    // Layer 2: Layout optimization
    optimizedLayout: {
      sheetLayout,
      cuttingConfig,
      isCalculating: isLayoutCalculating,
    },

    // Layer 3: Visual enhancements
    updateVisualEnhancements,
    updatePartEdge,
    updatePartCorner,
    updatePartLShape,

    // Enhanced data for UI
    enhancedParts,
    getEnhancedPartById,

    // Optimized selectors
    getDimensionalPartsOnly,
    getLayoutDataOnly,
    getVisualEnhancementsOnly,

    // Summary calculations
    totalCuttingArea,
    totalPartCount,
  }
}
