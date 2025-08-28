import React, { useMemo } from 'react'
import type { SheetLayout } from '../../../types/simple'
import type { EnhancedCuttingPart } from '../../../hooks/three-layer/useLayeredCuttingState'
import {
  getMaterialConfig,
  generateOrderId,
  getCurrentTimestamp,
  isPartRotated,
  formatEfficiencyPercentage,
  formatAreaInSquareMeters,
} from '../../../utils/layoutVisualizationHelpers'
import {
  SupplierDataContainer,
  SupplierDataTitle,
  DataOutput,
  CopyButton,
} from './SupplierDataOutput.styles'

interface SupplierDataOutputProps {
  sheetLayout: SheetLayout | null
  enhancedParts?: EnhancedCuttingPart[]
}

export const SupplierDataOutput: React.FC<SupplierDataOutputProps> = React.memo(
  ({ sheetLayout, enhancedParts = [] }) => {
    // Generate supplier data format
    const supplierData = useMemo(() => {
      if (!sheetLayout || !enhancedParts.length) {
        return null
      }

      // Create complete GAP 010 data structure with positioning
      const outputData = {
        order: generateOrderId(),
        timestamp: getCurrentTimestamp(),

        // Material specification
        material: getMaterialConfig(),

        // Complete sheet layout with positioning data
        sheets: sheetLayout.sheets.map((sheet) => {
          // Since we're no longer using composite blocks, use placed parts directly
          const exportParts = sheet.placedParts

          return {
            sheetNumber: sheet.sheetNumber,
            dimensions: {
              width: sheet.sheetWidth,
              height: sheet.sheetHeight,
            },
            cuts: exportParts.map((placedPart) => ({
              pieceId: placedPart.part.id,
              position: {
                x: placedPart.x,
                y: placedPart.y,
              },
              dimensions: {
                width: isPartRotated(placedPart.rotation)
                  ? placedPart.part.height
                  : placedPart.part.width,
                height: isPartRotated(placedPart.rotation)
                  ? placedPart.part.width
                  : placedPart.part.height,
              },
              rotation: placedPart.rotation,
              // Reference to piece specification
              pieceType:
                enhancedParts.find((p) => p.id === placedPart.part.id)?.label ||
                `${placedPart.part.width}x${placedPart.part.height}`,
            })),
            efficiency: formatEfficiencyPercentage(sheet.efficiency),
            wastedArea:
              sheet.sheetWidth * sheet.sheetHeight -
              exportParts.reduce(
                (sum, p) => sum + p.part.width * p.part.height,
                0,
              ),
          }
        }),

        // Part specifications (for reference)
        pieces: enhancedParts.map((part) => ({
          id: part.id,
          width: part.width,
          height: part.height,
          quantity: part.quantity,
          type: part.label || `${part.width}x${part.height}`,

          // Edge processing (only if not 'none')
          ...(Object.values(part.edges || {}).some(
            (edge) => edge !== 'none',
          ) && {
            edges: Object.fromEntries(
              Object.entries(part.edges || {}).filter(
                ([, value]) => value !== 'none',
              ),
            ),
          }),

          // Additional processing (only if enabled)
          ...(part.hasCornerModifications && { corners: true }),
          ...(part.isLShape && { lShape: true }),
          ...(part.isFrame && { frame: true }),

          // Block grouping (only if assigned)
          ...(part.blockId && { block: part.blockId }),

          // Rotation capability
          ...(part.orientation === 'rotatable' && { rotatable: true }),
        })),

        // Unplaced pieces (if any)
        ...(sheetLayout.unplacedParts.length > 0 && {
          unplacedPieces: sheetLayout.unplacedParts.map((part) => ({
            id: part.id,
            width: part.width,
            height: part.height,
            originalQuantity: part.quantity || 1,
            reason: 'Could not fit on available sheets',
          })),
        }),

        summary: (() => {
          // Calculate total placed pieces from all sheets
          const allPlacedPieces = sheetLayout.sheets.flatMap(
            (sheet) => sheet.placedParts,
          )

          return {
            totalPieces: enhancedParts.reduce(
              (sum, part) => sum + part.quantity,
              0,
            ),
            placedPieces: allPlacedPieces.length,
            unplacedPieces: sheetLayout.unplacedParts.length,
            sheets: sheetLayout.totalSheets,
            overallEfficiency: formatEfficiencyPercentage(
              sheetLayout.overallEfficiency,
            ),
            totalMaterialUsed: formatAreaInSquareMeters(
              sheetLayout.sheets.reduce(
                (sum, sheet) => sum + sheet.sheetWidth * sheet.sheetHeight,
                0,
              ),
            ), // in m²
            totalWastedArea: formatAreaInSquareMeters(
              sheetLayout.sheets.reduce((sum, sheet) => {
                return (
                  sum +
                  (sheet.sheetWidth * sheet.sheetHeight -
                    sheet.placedParts.reduce(
                      (partSum, p) => partSum + p.part.width * p.part.height,
                      0,
                    ))
                )
              }, 0),
            ), // in m²
          }
        })(),

        // Verification data for debugging
        verification: (() => {
          const allPlacedPieces = sheetLayout.sheets.flatMap(
            (sheet) => sheet.placedParts,
          )
          const expectedCount = enhancedParts.reduce(
            (sum, part) => sum + part.quantity,
            0,
          )
          const actualCount = allPlacedPieces.length

          return {
            expectedPieceCount: expectedCount,
            actualPlacedCount: actualCount,
            unplacedCount: sheetLayout.unplacedParts.length,
            discrepancy:
              expectedCount - (actualCount + sheetLayout.unplacedParts.length),
          }
        })(),
      }

      return JSON.stringify(outputData, null, 2)
    }, [sheetLayout, enhancedParts])

    const handleCopyData = () => {
      if (supplierData) {
        navigator.clipboard.writeText(supplierData)
      }
    }

    if (!supplierData) {
      return (
        <SupplierDataContainer>
          <SupplierDataTitle>
            Export GAP 010 - Complete Cutting Layout
          </SupplierDataTitle>
        </SupplierDataContainer>
      )
    }

    return (
      <SupplierDataContainer>
        <SupplierDataTitle>
          Export GAP 010 - Complete Cutting Layout
        </SupplierDataTitle>
        <CopyButton onClick={handleCopyData}>Kopírovať dáta</CopyButton>
        <DataOutput>{supplierData}</DataOutput>
      </SupplierDataContainer>
    )
  },
)

SupplierDataOutput.displayName = 'SupplierDataOutput'
