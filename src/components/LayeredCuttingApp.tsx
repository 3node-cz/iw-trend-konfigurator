import React, { useState, useMemo, useCallback } from 'react'
import type { Part, CornerModification } from '../types/simple'
import type { EdgeValue } from '../utils/edgeConstants'
import { useLayeredCuttingState } from '../hooks/three-layer'
import { LoadingIndicator, LoadingDots } from './LoadingIndicator'
import { DimensionalPartForm } from './three-layer/dimensional/DimensionalPartForm'
import { EnhancedPartsList } from './three-layer/EnhancedPartsList'
import { VisualEnhancementEditor } from './three-layer/visual/VisualEnhancementEditor'
import { OptimizedLayoutVisualization } from './three-layer/layout/OptimizedLayoutVisualization'
import {
  AppContainer,
  Header,
  MainGrid,
  LeftColumn,
  RightColumn,
  LayoutContainer,
} from './LayeredCuttingApp.styles'

// Simple memoized components for performance
const MemoizedEnhancedPartsList = React.memo(EnhancedPartsList)
const MemoizedOptimizedLayoutVisualization = React.memo(
  OptimizedLayoutVisualization,
)
const MemoizedVisualEnhancementEditor = React.memo(VisualEnhancementEditor)

export const LayeredCuttingApp: React.FC = () => {
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null)

  const {
    // Layer 1: Dimensional data operations
    addDimensionalPart,
    updateDimensionalPart,
    removeDimensionalPart,
    clearAllParts,

    // Layer 2: Layout optimization (read-only)
    optimizedLayout,

    // Layer 3: Visual enhancement operations
    updateVisualEnhancements,
    updatePartEdge,
    updatePartCorner,
    updatePartLShape,

    // Enhanced data for UI
    enhancedParts,
    getEnhancedPartById,

    // Summary calculations
    totalCuttingArea,
    totalPartCount,
  } = useLayeredCuttingState()

  // Extract optimized layout properties for easier usage
  const { sheetLayout, isCalculating: isLayoutCalculating } = optimizedLayout

  // Block update handler for managing part grouping
  const handlePartBlockUpdate = useCallback(
    (partId: string, blockId: number | undefined) => {
      updateDimensionalPart(partId, { blockId })
    },
    [updateDimensionalPart],
  )

  // Optimized: Memoize selected part to avoid recalculation on every render
  const selectedPart = useMemo(() => {
    return selectedPartId ? getEnhancedPartById(selectedPartId) : null
  }, [selectedPartId, getEnhancedPartById])

  // Optimized: Memoize unified update handler to prevent unnecessary re-renders
  const updatePart = useCallback(
    (id: string, updates: Partial<Part>) => {
      const { width, height, quantity, orientation, label, ...visualUpdates } =
        updates

      // Update cutting properties if any cutting-relevant properties changed
      if (
        width !== undefined ||
        height !== undefined ||
        quantity !== undefined ||
        orientation !== undefined ||
        label !== undefined
      ) {
        const cuttingUpdates: Partial<
          Omit<Part, 'id' | 'corners' | 'edges' | 'lShape'>
        > = {}
        if (width !== undefined) cuttingUpdates.width = width
        if (height !== undefined) cuttingUpdates.height = height
        if (quantity !== undefined) cuttingUpdates.quantity = quantity
        if (orientation !== undefined) cuttingUpdates.orientation = orientation
        if (label !== undefined) cuttingUpdates.label = label

        updateDimensionalPart(id, cuttingUpdates)
      }

      // Update visual properties (no layout impact)
      if (Object.keys(visualUpdates).length > 0) {
        updateVisualEnhancements(id, visualUpdates)
      }

      // Handle specific visual updates with direct methods
      if (visualUpdates.edges) {
        const edgeMap = { top: 0, right: 1, bottom: 2, left: 3 } as const
        Object.entries(visualUpdates.edges).forEach(([edge, value]) => {
          const edgeIndex = edgeMap[edge as keyof typeof edgeMap]
          if (edgeIndex !== undefined) {
            updatePartEdge(id, edgeIndex, value as EdgeValue)
          }
        })
      }

      if (visualUpdates.corners) {
        const cornerMap = {
          topLeft: 0,
          topRight: 1,
          bottomRight: 2,
          bottomLeft: 3,
        } as const
        Object.entries(visualUpdates.corners).forEach(
          ([corner, cornerData]) => {
            const cornerIndex = cornerMap[corner as keyof typeof cornerMap]
            if (cornerIndex !== undefined) {
              updatePartCorner(
                id,
                cornerIndex,
                cornerData as CornerModification,
              )
            }
          },
        )
      }

      if (visualUpdates.lShape) {
        updatePartLShape(id, visualUpdates.lShape)
      }
    },
    [
      updateDimensionalPart,
      updateVisualEnhancements,
      updatePartEdge,
      updatePartCorner,
      updatePartLShape,
    ],
  )

  return (
    <AppContainer>
      <Header>
        <h1>Konfigurátor porezu</h1>
        <p>Jednoduché nástroj pre plánovanie rozloženia dielcov na doske</p>
        <LoadingDots isLoading={isLayoutCalculating} />
      </Header>

      <MainGrid>
        <LeftColumn>
          <DimensionalPartForm onAddPart={addDimensionalPart} />

          <MemoizedEnhancedPartsList
            enhancedParts={enhancedParts}
            totalArea={totalCuttingArea}
            totalParts={totalPartCount}
            selectedPartId={selectedPartId || undefined}
            onPartSelect={setSelectedPartId}
            onRemovePart={removeDimensionalPart}
            onClearAll={clearAllParts}
            onPartBlockUpdate={handlePartBlockUpdate}
          />

          <MemoizedVisualEnhancementEditor
            selectedPart={selectedPart}
            onPartUpdate={updatePart}
          />
        </LeftColumn>

        <RightColumn>
          <LayoutContainer>
            <MemoizedOptimizedLayoutVisualization sheetLayout={sheetLayout} />
            <LoadingIndicator
              isLoading={isLayoutCalculating}
              message="Calculating optimal layout..."
              overlay={true}
            />
          </LayoutContainer>
        </RightColumn>
      </MainGrid>
    </AppContainer>
  )
}
