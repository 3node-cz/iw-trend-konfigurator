import React, { useState, useMemo } from 'react'
import type { SheetLayout, Part } from '../../../types/simple'
import { SHEET_VISUALIZATION } from '../../../utils/appConstants'
import {
  getConsistentPartColor,
  getBasePartId,
} from '../../../utils/colorManagement'
import {
  calculateSheetScale,
  groupPartsByBaseId,
  calculateWastedArea,
  calculateLayoutStats,
  getPartDimensions,
} from '../../../utils/sheetVisualizationHelpers'
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
  enhancedParts?: Part[] // For calculating accurate block borders
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
          return groupPartsByBaseId(placedParts)
        })(),
        wastedArea: calculateWastedArea(sheetWidth, sheetHeight, placedParts),
        layoutStats: calculateLayoutStats(sheetLayout),
      }
    }, [sheetLayout, selectedSheetIndex])

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

            {/* Placed parts - render as blocks with internal borders */}
            {placedParts.map((placedPart) => {
              const basePartId = getBasePartId(placedPart.part.id)
              const partColor = getConsistentPartColor(
                basePartId,
                placedPart.part,
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

            {/* Internal borders for blocks - render borders to show individual pieces within blocks */}
            {placedParts.map((placedPart) => {
              // Only render internal borders for composite block parts
              const isCompositeBlock =
                placedPart.part.id.startsWith('block-') ||
                placedPart.part.id.startsWith('subblock-')

              console.log(
                `Checking part ${placedPart.part.id}: isCompositeBlock=${isCompositeBlock}, blockId=${placedPart.part.blockId}`,
              )

              if (!isCompositeBlock || !placedPart.part.blockId) return null

              // Find all enhanced parts that belong to this block
              // For composite blocks, we need to find original parts that have the same blockId
              const blockParts = enhancedParts.filter(
                (part) => part.blockId === placedPart.part.blockId,
              )

              console.log(
                `Block ${placedPart.part.blockId}: found ${blockParts.length} enhanced parts`,
              )
              console.log(
                `Available enhanced parts:`,
                enhancedParts.map((p) => ({
                  id: p.id,
                  blockId: p.blockId,
                  width: p.width,
                  quantity: p.quantity,
                })),
              )
              console.log(`Looking for blockId:`, placedPart.part.blockId)
              console.log(
                `Matching parts:`,
                blockParts.map((p) => ({
                  id: p.id,
                  blockId: p.blockId,
                  width: p.width,
                  quantity: p.quantity,
                })),
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

              console.log(
                `Block ${placedPart.part.blockId}: ${
                  individualPieces.length
                } pieces, widths: ${individualPieces
                  .map((p) => p.width)
                  .join(', ')}`,
              )

              // For blocks with multiple pieces, render internal borders
              if (individualPieces.length > 1) {
                const borders = []

                // Check if the block is rotated using the rotation property
                const isRotated = placedPart.rotation === 90

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
                        console.log(
                          `Rendering horizontal border at y=${currentY}, x=${
                            placedPart.x
                          } to x=${placedPart.x + totalBlockWidth}`,
                        )
                        borders.push(
                          <line
                            key={`border-${placedPart.part.id}-${borders.length}`}
                            x1={placedPart.x}
                            y1={currentY}
                            x2={placedPart.x + totalBlockWidth}
                            y2={currentY}
                            stroke="#FF0000"
                            strokeWidth="6"
                            opacity="1.0"
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
                    console.log(
                      `Rendering vertical border at x=${currentX}, y=${
                        placedPart.y
                      } to y=${placedPart.y + totalBlockHeight}`,
                    )
                    borders.push(
                      <line
                        key={`border-${placedPart.part.id}-${i}`}
                        x1={currentX}
                        y1={placedPart.y}
                        x2={currentX}
                        y2={placedPart.y + totalBlockHeight}
                        stroke="#FF0000"
                        strokeWidth="6"
                        opacity="1.0"
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
                {(sheetLayout.overallEfficiency * 100).toFixed(1)}%
              </span>
              <div className="label">Celková efektivita</div>
            </InfoCard>

            <InfoCard>
              <span className="value">{(efficiency * 100).toFixed(1)}%</span>
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
