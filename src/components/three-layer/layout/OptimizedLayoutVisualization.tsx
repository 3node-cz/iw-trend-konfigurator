import React, { useState, useMemo } from 'react'
import type { SheetLayout } from '../../../types/simple'
import { SHEET_VISUALIZATION } from '../../../utils/appConstants'
import { getConsistentPartColor } from '../../../utils/colorManagement'
import {
  calculateSheetScale,
  groupPartsByBaseId,
  calculateWastedArea,
  calculateLayoutStats,
  getPartDimensions,
  formatAreaInSquareMeters,
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
  PartText,
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
}

export const OptimizedLayoutVisualization: React.FC<SheetVisualizationProps> =
  React.memo(({ sheetLayout }) => {
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
        partGroups: groupPartsByBaseId(placedParts),
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
      wastedArea,
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

            {/* Placed parts */}
            {placedParts.map((placedPart) => {
              const partColor = getConsistentPartColor(placedPart.part.id)
              const { width: partWidth, height: partHeight } =
                getPartDimensions(placedPart)

              return (
                <g key={placedPart.part.id}>
                  <PartRect
                    x={placedPart.x}
                    y={placedPart.y}
                    width={partWidth}
                    height={partHeight}
                    $color={partColor}
                  />
                  {/* Only show text for parts that are large enough to display it clearly */}
                  {Math.min(partWidth, partHeight) > 200 && (
                    <PartText
                      x={placedPart.x + partWidth / 2}
                      y={placedPart.y + partHeight / 2}
                      dominantBaseline="central"
                    >
                      {partWidth}×{partHeight}
                      {placedPart.rotation === 90 && ' ↻'}
                    </PartText>
                  )}
                </g>
              )
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

            <InfoCard>
              <span className="value">
                {formatAreaInSquareMeters(wastedArea)} m²
              </span>
              <div className="label">Odpad tejto dosky</div>
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
