import React, { useState } from 'react'
import styled from 'styled-components'
import type { SheetLayout } from '../types/simple'
import { SHEET_VISUALIZATION } from '../utils/appConstants'
import {
  calculateSheetScale,
  groupPartsByBaseId,
  calculateWastedArea,
  calculateLayoutStats,
  getPartDimensions,
  formatAreaInSquareMeters,
} from '../utils/sheetVisualizationHelpers'

const VisualizationContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
`

const VisualizationTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.3rem;
`

const SheetSelector = styled.div`
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

const SheetTab = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: 2px solid #3498db;
  border-radius: 6px;
  background: ${(props) => (props.$active ? '#3498db' : 'white')};
  color: ${(props) => (props.$active ? 'white' : '#3498db')};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$active ? '#2980b9' : '#ecf0f1')};
  }
`

const SheetContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`

const BoardDimensions = styled.div`
  background: #e8f4fd;
  padding: 12px 20px;
  border-radius: 6px;
  text-align: center;
  border: 1px solid #bdd9f0;
  margin-bottom: 8px;

  .board-dimensions {
    font-weight: 700;
    color: #2c3e50;
    font-size: 1.1rem;
  }

  .board-label {
    font-size: 0.8rem;
    color: #7f8c8d;
    margin-top: 2px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`

const SheetSVG = styled.svg`
  border: 2px solid #2c3e50;
  border-radius: 4px;
  background: #f8f9fa;
  max-width: 100%;
  height: auto;
`

const PartRect = styled.rect<{ $index: number }>`
  fill: ${(props) => {
    return SHEET_VISUALIZATION.partColors[
      props.$index % SHEET_VISUALIZATION.partColors.length
    ]
  }};
  stroke: ${SHEET_VISUALIZATION.colors.sheetBorder};
  stroke-width: ${SHEET_VISUALIZATION.strokeWidth.part};
  opacity: 0.8;

  &:hover {
    opacity: 1;
    stroke-width: ${SHEET_VISUALIZATION.strokeWidth.partHover};
  }
`

const PartText = styled.text`
  fill: ${SHEET_VISUALIZATION.colors.partText};
  font-size: ${SHEET_VISUALIZATION.fontSize.partLabel}px;
  font-weight: bold;
  text-anchor: middle;
  pointer-events: none;
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  width: 100%;
  margin-top: 12px;
`

const InfoCard = styled.div`
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
  text-align: center;
  border: 1px solid #e1e8ed;

  .value {
    font-size: 1.2rem;
    font-weight: 700;
    color: #2c3e50;
    display: block;
  }

  .label {
    font-size: 0.8rem;
    color: #7f8c8d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 4px;
  }
`

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
`

const LegendItem = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;

  &::before {
    content: '';
    width: 12px;
    height: 12px;
    background: ${(props) => props.$color};
    border-radius: 2px;
    border: 1px solid #2c3e50;
  }
`

interface SheetVisualizationProps {
  sheetLayout: SheetLayout | null
}

export const SheetVisualization: React.FC<SheetVisualizationProps> = ({
  sheetLayout,
}) => {
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0)

  if (!sheetLayout || sheetLayout.sheets.length === 0) {
    return (
      <VisualizationContainer>
        <VisualizationTitle>Rozloženie na doskách</VisualizationTitle>
        <div
          style={{
            textAlign: 'center',
            color: '#7f8c8d',
            padding: '40px 20px',
          }}
        >
          <p>Pridajte dielce pre zobrazenie rozloženia na doskách</p>
        </div>
      </VisualizationContainer>
    )
  }

  const currentSheet = sheetLayout.sheets[selectedSheetIndex]
  const { sheetWidth, sheetHeight, placedParts, efficiency } = currentSheet

  // Calculate scale to fit in container
  const { scaledWidth, scaledHeight } = calculateSheetScale(
    sheetWidth,
    sheetHeight,
  )

  // Group parts by original part for legend
  const partGroups = groupPartsByBaseId(placedParts)

  const wastedArea = calculateWastedArea(sheetWidth, sheetHeight, placedParts)
  const { totalPlacedParts, totalRequestedParts } =
    calculateLayoutStats(sheetLayout)

  return (
    <VisualizationContainer>
      <VisualizationTitle>Rozloženie na doskách</VisualizationTitle>

      {sheetLayout.sheets.length > 1 && (
        <SheetSelector>
          <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>Doska:</span>
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
            const baseId = placedPart.part.id.replace(/-\d+$/, '')
            const colorIndex = Object.keys(partGroups).indexOf(baseId)
            const { width: partWidth, height: partHeight } =
              getPartDimensions(placedPart)

            return (
              <g key={placedPart.part.id}>
                <PartRect
                  x={placedPart.x}
                  y={placedPart.y}
                  width={partWidth}
                  height={partHeight}
                  $index={colorIndex}
                />
                <PartText
                  x={placedPart.x + partWidth / 2}
                  y={placedPart.y + partHeight / 2}
                  dominantBaseline="central"
                >
                  {partWidth}×{partHeight}
                  {placedPart.rotation === 90 && ' ↻'}
                </PartText>
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
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#fff3cd',
              borderRadius: '6px',
              border: '1px solid #ffeaa7',
            }}
          >
            <h4 style={{ color: '#856404', margin: '0 0 8px 0' }}>
              Neumiestnené dielce:
            </h4>
            {sheetLayout.unplacedParts.map((part) => (
              <div
                key={part.id}
                style={{ color: '#856404', fontSize: '0.9rem' }}
              >
                • {part.width}×{part.height}mm {part.label && `(${part.label})`}
              </div>
            ))}
          </div>
        )}
      </SheetContainer>
    </VisualizationContainer>
  )
}
