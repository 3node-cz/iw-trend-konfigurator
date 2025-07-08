import React, { useState, useMemo } from 'react'
import type { SheetLayout, PlacedPart } from '../../../types/simple'
import type { EnhancedCuttingPart } from '../../../hooks/three-layer/useLayeredCuttingState'
import { getBasePartId } from '../../../utils/colorManagement'
import { SHEET_VISUALIZATION } from '../../../utils/appConstants'
import {
  calculateSheetScale,
  groupPartsByBaseId,
  calculateWastedArea,
  calculateLayoutStats,
  getPartDimensions,
} from '../../../utils/sheetVisualizationHelpers'
import { getVisualizationPartColor } from '../../../utils/visualizationHelpers'
import {
  getBlockBorderStyle,
  getInnerBlockBorderStyle,
  isPartRotated,
  formatEfficiencyPercentage,
} from '../../../utils/layoutVisualizationHelpers'
import {
  VisualizationContainer,
  VisualizationTitle,
  SheetSelector,
  SheetTab,
  SheetContainer,
  BoardDimensions,
  SheetSVG,
  PartRect,
  InfoGrid,
  InfoCard,
  Legend,
  LegendItem,
  EmptyStateMessage,
  BoldLabel,
  UnplacedPartsContainer,
  UnplacedPartsTitle,
  UnplacedPartsList,
} from './OptimizedLayoutVisualization.styles'

interface SheetVisualizationProps {
  sheetLayout: SheetLayout | null
  enhancedParts?: EnhancedCuttingPart[] // For calculating accurate block borders and colors
}

export const OptimizedLayoutVisualization: React.FC<SheetVisualizationProps> =
  React.memo(({ sheetLayout, enhancedParts = [] }) => {
    const [selectedSheetIndex, setSelectedSheetIndex] = useState(0)

    // Memoize expensive calculations for the current sheet
    const currentSheetData = useMemo(() => {
      if (!sheetLayout || sheetLayout.sheets.length === 0) return null

      const currentSheet = sheetLayout.sheets[selectedSheetIndex]
      const { sheetWidth, sheetHeight, placedParts, efficiency } = currentSheet

      return {
        currentSheet,
        sheetWidth,
        sheetHeight,
        placedParts,
        efficiency,
        scaledDimensions: calculateSheetScale(sheetWidth, sheetHeight),
        partGroups: (() => {
          return groupPartsByBaseId(placedParts, enhancedParts)
        })(),
        wastedArea: calculateWastedArea(sheetWidth, sheetHeight, placedParts),
        layoutStats: calculateLayoutStats(sheetLayout),
      }
    }, [sheetLayout, selectedSheetIndex, enhancedParts])

    if (!sheetLayout || sheetLayout.sheets.length === 0) {
      return (
        <VisualizationContainer>
          <VisualizationTitle>Rozloženie na doskách</VisualizationTitle>
          <EmptyStateMessage>
            <p>Pridajte dielce pre zobrazenie rozloženia na doskách</p>
          </EmptyStateMessage>
        </VisualizationContainer>
      )
    }

    const {
      sheetWidth,
      sheetHeight,
      placedParts,
      efficiency,
      scaledDimensions: { scaledWidth, scaledHeight },
      partGroups,
      layoutStats: { totalPlacedParts, totalRequestedParts },
    } = currentSheetData!

    return (
      <VisualizationContainer>
        <VisualizationTitle>Rozloženie na doskách</VisualizationTitle>

        {sheetLayout.sheets.length > 1 && (
          <SheetSelector>
            <BoldLabel>Doska:</BoldLabel>
            {sheetLayout.sheets.map((sheet, index) => (
              <SheetTab
                key={sheet.sheetNumber}
                $active={selectedSheetIndex === index}
                onClick={() => setSelectedSheetIndex(index)}
              >
                Doska {sheet.sheetNumber}
              </SheetTab>
            ))}
          </SheetSelector>
        )}

        <SheetContainer>
          <BoardDimensions>
            <div className="board-dimensions">
              {sheetWidth} × {sheetHeight} mm
            </div>
            <div className="board-label">Rozmery dosky</div>
          </BoardDimensions>

          <SheetSVG
            width={scaledWidth}
            height={scaledHeight}
            viewBox={`0 0 ${sheetWidth} ${sheetHeight}`}
          >
            {/* Sheet background */}
            <rect
              x="0"
              y="0"
              width={sheetWidth}
              height={sheetHeight}
              fill={SHEET_VISUALIZATION.colors.sheetBackground}
              stroke={SHEET_VISUALIZATION.colors.sheetBorder}
              strokeWidth={SHEET_VISUALIZATION.strokeWidth.sheet}
            />

            {/* Grid lines for better visualization */}
            <defs>
              <pattern
                id="grid"
                width={SHEET_VISUALIZATION.gridSize}
                height={SHEET_VISUALIZATION.gridSize}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${SHEET_VISUALIZATION.gridSize} 0 L 0 0 0 ${SHEET_VISUALIZATION.gridSize}`}
                  fill="none"
                  stroke={SHEET_VISUALIZATION.colors.gridLines}
                  strokeWidth={SHEET_VISUALIZATION.strokeWidth.grid}
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#grid)"
            />

            {/* Placed parts - render with consistent colors */}
            {placedParts.map((placedPart) => {
              const partColor = getVisualizationPartColor(
                placedPart.part.id,
                enhancedParts,
              )
              const { width: partWidth, height: partHeight } =
                getPartDimensions(placedPart)

              return (
                <g key={placedPart.part.id}>
                  {/* Main block rectangle */}
                  <PartRect
                    x={placedPart.x}
                    y={placedPart.y}
                    width={partWidth}
                    height={partHeight}
                    $color={partColor}
                  />

                  {/* Text labels removed - they were too small and redundant */}
                </g>
              )
            })}

            {/* Block group indicators - draw red dashed borders around grouped pieces */}
            {(() => {
              if (!enhancedParts) return null

              // Group placed parts by blockId based on their original enhanced part
              const blockGroups = new Map<number, PlacedPart[]>()
              placedParts.forEach((placedPart) => {
                // Find the original enhanced part to get block info
                const baseId = getBasePartId(placedPart.part.id)
                const enhancedPart = enhancedParts.find((p) => p.id === baseId)

                if (enhancedPart?.blockId) {
                  if (!blockGroups.has(enhancedPart.blockId)) {
                    blockGroups.set(enhancedPart.blockId, [])
                  }
                  blockGroups.get(enhancedPart.blockId)!.push(placedPart)
                }
              })

              // Render block borders for groups with multiple pieces
              return Array.from(blockGroups.entries()).map(
                ([blockId, parts]) => {
                  if (parts.length < 2) return null // No need to show border for single pieces

                  // Calculate bounding box for all parts in the block
                  const minX = Math.min(...parts.map((p) => p.x))
                  const minY = Math.min(...parts.map((p) => p.y))
                  const maxX = Math.max(
                    ...parts.map((p) => {
                      const { width } = getPartDimensions(p)
                      return p.x + width
                    }),
                  )
                  const maxY = Math.max(
                    ...parts.map((p) => {
                      const { height } = getPartDimensions(p)
                      return p.y + height
                    }),
                  )

                  return (
                    <rect
                      key={`block-border-${blockId}`}
                      x={minX - 2}
                      y={minY - 2}
                      width={maxX - minX + 4}
                      height={maxY - minY + 4}
                      fill="none"
                      stroke={getBlockBorderStyle().color}
                      strokeWidth="3"
                      strokeDasharray="8,4"
                      opacity="0.8"
                    />
                  )
                },
              )
            })()}

            {/* Inner borders within blocks - show separations between pieces */}
            {(() => {
              if (!enhancedParts) return null

              // Group placed parts by blockId for inner borders
              const blockGroups = new Map<number, PlacedPart[]>()
              placedParts.forEach((placedPart) => {
                const baseId = getBasePartId(placedPart.part.id)
                const enhancedPart = enhancedParts.find((p) => p.id === baseId)

                if (enhancedPart?.blockId) {
                  if (!blockGroups.has(enhancedPart.blockId)) {
                    blockGroups.set(enhancedPart.blockId, [])
                  }
                  blockGroups.get(enhancedPart.blockId)!.push(placedPart)
                }
              })

              // Render inner borders for blocks with multiple pieces
              const innerBorders: React.ReactElement[] = []
              blockGroups.forEach((parts, blockId) => {
                if (parts.length < 2) return // No borders needed for single pieces

                // Sort parts by X position (assuming horizontal layout within blocks)
                const sortedParts = [...parts].sort((a, b) => a.x - b.x)

                // Draw vertical borders between adjacent pieces
                for (let i = 0; i < sortedParts.length - 1; i++) {
                  const currentPart = sortedParts[i]
                  const nextPart = sortedParts[i + 1]

                  const { width: currentWidth, height: currentHeight } =
                    getPartDimensions(currentPart)
                  const borderX = currentPart.x + currentWidth

                  // Only draw border if pieces are actually adjacent (within 5mm)
                  if (Math.abs(borderX - nextPart.x) <= 5) {
                    innerBorders.push(
                      <line
                        key={`inner-border-${blockId}-${i}`}
                        x1={borderX}
                        y1={currentPart.y}
                        x2={borderX}
                        y2={currentPart.y + currentHeight}
                        stroke="#34495e"
                        strokeWidth="4"
                        opacity="0.9"
                      />,
                    )
                  }
                }
              })

              return innerBorders
            })()}

            {/* Internal borders for blocks - render borders to show individual pieces within blocks */}
            {placedParts.map((placedPart) => {
              // Only render internal borders for composite block parts
              const isCompositeBlock =
                placedPart.part.id.startsWith('block-') ||
                placedPart.part.id.startsWith('subblock-')

              if (!isCompositeBlock || !placedPart.part.blockId) return null

              // Find all enhanced parts that belong to this block
              // For composite blocks, we need to find original parts that have the same blockId
              const blockParts = enhancedParts.filter(
                (part) => part.blockId === placedPart.part.blockId,
              )

              if (blockParts.length === 0) return null

              // Create array of individual pieces with their actual placed dimensions
              const individualPieces: { width: number; height: number }[] = []

              // Get the total placed dimensions of the composite block
              const { width: totalBlockWidth, height: totalBlockHeight } =
                getPartDimensions(placedPart)

              // Calculate total original width of all pieces in the block
              const totalOriginalWidth = blockParts.reduce(
                (sum, part) => sum + part.width * part.quantity,
                0,
              )

              // For each part, calculate its placed width proportionally
              blockParts.forEach((part) => {
                for (let i = 0; i < part.quantity; i++) {
                  const proportionalWidth =
                    (part.width / totalOriginalWidth) * totalBlockWidth
                  individualPieces.push({
                    width: proportionalWidth,
                    height: totalBlockHeight,
                  })
                }
              })

              // For blocks with multiple pieces, render internal borders
              if (individualPieces.length > 1) {
                const borders = []

                // Check if the block is rotated using the rotation property
                const isRotated = isPartRotated(placedPart.rotation)

                if (isRotated) {
                  // Block is rotated - render horizontal borders (pieces stacked vertically)
                  let currentY = Number(placedPart.y)

                  // When rotated, pieces are stacked vertically, so we need to calculate heights
                  const totalOriginalHeight = blockParts.reduce(
                    (sum, part) => sum + part.height * part.quantity,
                    0,
                  )

                  blockParts.forEach((part) => {
                    for (let i = 0; i < part.quantity; i++) {
                      if (currentY > Number(placedPart.y)) {
                        // Don't render border before first piece
                        borders.push(
                          <line
                            key={`border-${placedPart.part.id}-${borders.length}`}
                            x1={placedPart.x}
                            y1={currentY}
                            x2={placedPart.x + totalBlockWidth}
                            y2={currentY}
                            stroke={getInnerBlockBorderStyle().color}
                            strokeWidth={getInnerBlockBorderStyle().width}
                            opacity={getInnerBlockBorderStyle().opacity}
                          />,
                        )
                      }
                      // Calculate proportional height for this piece
                      const proportionalHeight =
                        (part.height / totalOriginalHeight) * totalBlockHeight
                      currentY += proportionalHeight
                    }
                  })
                } else {
                  // Block is not rotated - render vertical borders (pieces side by side)
                  let currentX = Number(placedPart.x)

                  for (let i = 0; i < individualPieces.length - 1; i++) {
                    currentX += Number(individualPieces[i].width)
                    borders.push(
                      <line
                        key={`border-${placedPart.part.id}-${i}`}
                        x1={currentX}
                        y1={placedPart.y}
                        x2={currentX}
                        y2={placedPart.y + totalBlockHeight}
                        stroke={getInnerBlockBorderStyle().color}
                        strokeWidth={getInnerBlockBorderStyle().width}
                        opacity={getInnerBlockBorderStyle().opacity}
                      />,
                    )
                  }
                }

                return borders
              }

              return null
            })}

            {/* Sheet dimensions */}
            <text
              x={sheetWidth / 2}
              y={sheetHeight + SHEET_VISUALIZATION.spacing.dimensionOffset}
              textAnchor="middle"
              fontSize={SHEET_VISUALIZATION.fontSize.dimensions}
              fill={SHEET_VISUALIZATION.colors.dimensionText}
            >
              {sheetWidth}mm
            </text>
            <text
              x={-SHEET_VISUALIZATION.spacing.dimensionOffset}
              y={sheetHeight / 2}
              textAnchor="middle"
              fontSize={SHEET_VISUALIZATION.fontSize.dimensions}
              fill={SHEET_VISUALIZATION.colors.dimensionText}
              transform={`rotate(-90, -${
                SHEET_VISUALIZATION.spacing.dimensionOffset
              }, ${sheetHeight / 2})`}
            >
              {sheetHeight}mm
            </text>
          </SheetSVG>

          <InfoGrid>
            <InfoCard>
              <span className="value">{sheetLayout.totalSheets}</span>
              <div className="label">Počet dosiek</div>
            </InfoCard>

            <InfoCard>
              <span className="value">
                {totalPlacedParts}/{totalRequestedParts}
              </span>
              <div className="label">Umiestnené dielce</div>
            </InfoCard>

            <InfoCard>
              <span className="value">
                {formatEfficiencyPercentage(sheetLayout.overallEfficiency)}
              </span>
              <div className="label">Celková efektivita</div>
            </InfoCard>

            <InfoCard>
              <span className="value">
                {formatEfficiencyPercentage(efficiency)}
              </span>
              <div className="label">Efektivita tejto dosky</div>
            </InfoCard>
          </InfoGrid>

          {Object.keys(partGroups).length > 0 && (
            <Legend>
              {Object.entries(partGroups).map(([id, group]) => (
                <LegendItem
                  key={id}
                  $color={group.color}
                >
                  {group.label} ({group.count}×)
                </LegendItem>
              ))}
            </Legend>
          )}

          {sheetLayout.unplacedParts.length > 0 && (
            <UnplacedPartsContainer>
              <UnplacedPartsTitle>Neumiestnené dielce:</UnplacedPartsTitle>
              {sheetLayout.unplacedParts.map((part) => (
                <UnplacedPartsList key={part.id}>
                  • {part.width}×{part.height}mm{' '}
                  {part.label && `(${part.label})`}
                </UnplacedPartsList>
              ))}
            </UnplacedPartsContainer>
          )}
        </SheetContainer>
      </VisualizationContainer>
    )
  })
