import React, { useState, useMemo, useCallback } from 'react'
import type { Part } from '../types/simple'
import type { EdgeValue } from '../utils/edgeConstants'
import { useLayeredCuttingState } from '../hooks/three-layer'
import { hasBlockValidationErrors } from '../utils/blockValidation'
import {
  getConsistentPartColor,
  clearColorCache,
} from '../utils/colorManagement'
import {
  separatePartUpdates,
  processEdgeUpdates,
  processCornerUpdates,
} from '../utils/partUpdates'
import { LoadingIndicator, LoadingDots } from './LoadingIndicator'
import { DimensionalPartForm } from './three-layer/dimensional/DimensionalPartForm'
import { EnhancedPartsList } from './three-layer/EnhancedPartsList'
import { VisualEnhancementEditor } from './three-layer/visual/VisualEnhancementEditor'
import { OptimizedLayoutVisualization } from './three-layer/layout/OptimizedLayoutVisualization'
import { SupplierDataOutput } from './three-layer/layout/SupplierDataOutput'
import {
  AppContainer,
  Header,
  MainGrid,
  LeftColumn,
  RightColumn,
  LayoutContainer,
  ValidationErrorContainer,
  ValidationErrorText,
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

    // Wood type operations
    updatePartWoodType,

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
      if (blockId !== undefined) {
        // Clear color cache to ensure fresh color calculation
        clearColorCache()

        // Generate the block color using the block ID as the key
        const blockColor = getConsistentPartColor(`block-${blockId}`, {
          blockId: blockId,
          width: 100,
          height: 100,
        })

        // Find all parts that are currently in this block (before the update)
        const currentPartsInBlock = enhancedParts.filter(
          (p) => p.blockId === blockId,
        )

        // Update the current part to join the block
        updateDimensionalPart(partId, {
          blockId: blockId,
          color: blockColor,
        })

        // Update all existing parts in the block to have the same color
        currentPartsInBlock.forEach((part) => {
          updateDimensionalPart(part.id, {
            blockId: part.blockId, // Keep existing blockId
            color: blockColor,
          })
        })
      } else {
        // If removing from block, recalculate color for individual part
        const individualColor = getConsistentPartColor(partId, {
          blockId: undefined,
          width: enhancedParts.find((p) => p.id === partId)?.width,
          height: enhancedParts.find((p) => p.id === partId)?.height,
        })
        updateDimensionalPart(partId, {
          blockId: blockId,
          color: individualColor,
        })
      }
    },
    [updateDimensionalPart, enhancedParts],
  )

  // Rotation update handler for managing part rotation
  const handlePartRotationUpdate = useCallback(
    (partId: string, rotatable: boolean) => {
      updateDimensionalPart(partId, {
        orientation: rotatable ? 'rotatable' : 'fixed',
      })
    },
    [updateDimensionalPart],
  )

  // Edge update handler for managing part edges
  const handlePartEdgeUpdate = useCallback(
    (partId: string, edge: string, value: EdgeValue) => {
      const edgeKeys = ['top', 'right', 'bottom', 'left'] as const
      const edgeIndex = edgeKeys.indexOf(edge as (typeof edgeKeys)[number])
      if (edgeIndex !== -1) {
        updatePartEdge(partId, edgeIndex, value)
      }
    },
    [updatePartEdge],
  )

  // Optimized: Memoize selected part to avoid recalculation on every render
  const selectedPart = useMemo(() => {
    return selectedPartId ? getEnhancedPartById(selectedPartId) : null
  }, [selectedPartId, getEnhancedPartById])

  // Optimized: Memoize unified update handler to prevent unnecessary re-renders
  const updatePart = useCallback(
    (id: string, updates: Partial<Part>) => {
      const { cuttingUpdates, visualUpdates } = separatePartUpdates(updates)

      // Update cutting properties if any cutting-relevant properties changed
      if (Object.keys(cuttingUpdates).length > 0) {
        updateDimensionalPart(id, cuttingUpdates)
      }

      // Update visual properties (no layout impact)
      if (Object.keys(visualUpdates).length > 0) {
        updateVisualEnhancements(id, visualUpdates)
      }

      // Handle specific visual updates with direct methods
      if (visualUpdates.edges) {
        const edgeOperations = processEdgeUpdates(visualUpdates.edges)
        edgeOperations.forEach(({ edgeIndex, value }) => {
          updatePartEdge(id, edgeIndex, value)
        })
      }

      if (visualUpdates.corners) {
        const cornerOperations = processCornerUpdates(visualUpdates.corners)
        cornerOperations.forEach(({ cornerIndex, cornerData }) => {
          updatePartCorner(id, cornerIndex, cornerData)
        })
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

  // Check if there are validation errors to hide visualization
  const hasValidationErrors = hasBlockValidationErrors(enhancedParts)

  return (
    <AppContainer>
      <Header>
        <h1>Konfigurátor porezu</h1>
        <p>Jednoduché nástroj pre plánovanie rozloženia dielcov na doske</p>
        <LoadingDots isLoading={isLayoutCalculating} />
      </Header>

      <MainGrid>
        <LeftColumn>
          <DimensionalPartForm
            onAddPart={addDimensionalPart}
            existingParts={enhancedParts}
          />

          <MemoizedEnhancedPartsList
            enhancedParts={enhancedParts}
            totalArea={totalCuttingArea}
            totalParts={totalPartCount}
            selectedPartId={selectedPartId || undefined}
            onPartSelect={setSelectedPartId}
            onRemovePart={removeDimensionalPart}
            onClearAll={clearAllParts}
            onPartBlockUpdate={handlePartBlockUpdate}
            onPartRotationUpdate={handlePartRotationUpdate}
            onPartWoodTypeUpdate={updatePartWoodType}
            onPartEdgeUpdate={handlePartEdgeUpdate}
          />

          <MemoizedVisualEnhancementEditor
            selectedPart={selectedPart}
            onPartUpdate={updatePart}
          />
        </LeftColumn>

        <RightColumn>
          <LayoutContainer>
            {!hasValidationErrors ? (
              <>
                <MemoizedOptimizedLayoutVisualization
                  sheetLayout={sheetLayout}
                  enhancedParts={enhancedParts}
                />
                <LoadingIndicator
                  isLoading={isLayoutCalculating}
                  message="Calculating optimal layout..."
                  overlay={true}
                />
              </>
            ) : (
              <ValidationErrorContainer>
                <div>
                  <ValidationErrorText>
                    ⚠️ Opravte chyby validácie pred zobrazením náhľadu
                  </ValidationErrorText>
                  <ValidationErrorText className="secondary">
                    Skontrolujte šírku blokov v zozname dielcov
                  </ValidationErrorText>
                </div>
              </ValidationErrorContainer>
            )}
          </LayoutContainer>

          <SupplierDataOutput
            sheetLayout={sheetLayout}
            enhancedParts={enhancedParts}
          />
        </RightColumn>
      </MainGrid>
    </AppContainer>
  )
}
