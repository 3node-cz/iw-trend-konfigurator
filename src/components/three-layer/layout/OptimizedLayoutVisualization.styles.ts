/**
 * Styled components for OptimizedLayoutVisualization
 */
import styled from 'styled-components'
import { APP_CONFIG } from '../../../config/appConfig'

// Recreate the SHEET_VISUALIZATION structure from appConfig components
const SHEET_VISUALIZATION = {
  maxPreviewWidth: APP_CONFIG.visualization.sheet.maxPreviewWidth,
  maxPreviewHeight: APP_CONFIG.visualization.sheet.maxPreviewHeight,
  gridSize: APP_CONFIG.visualization.sheet.gridSize,
  strokeWidth: {
    sheet: 2,
    part: APP_CONFIG.visualization.parts.strokeWidth.normal,
    partHover: APP_CONFIG.visualization.parts.strokeWidth.hover,
    grid: 1,
  },
  colors: {
    sheetBackground: APP_CONFIG.visualization.sheet.backgroundColor,
    sheetBorder: APP_CONFIG.visualization.sheet.borderColor,
    gridLines: APP_CONFIG.visualization.sheet.gridColor,
    partText: APP_CONFIG.visualization.parts.text.color,
    dimensionText: APP_CONFIG.branding.colors.secondary,
  },
  partColors: APP_CONFIG.branding.colors.partsPalette,
}

export const VisualizationContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
`

export const VisualizationTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.3rem;
`

export const SheetSelector = styled.div`
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const SheetTab = styled.button<{ $active: boolean }>`
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

export const SheetContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const BoardDimensions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;

  .dimensions {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
  }

  .label {
    font-size: 0.8rem;
    color: #7f8c8d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`

export const SheetSVG = styled.svg`
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f8f9fa;
  max-width: 100%;
  height: auto;
`

export const PartRect = styled.rect<{ $color: string }>`
  fill: ${(props) => props.$color};
  stroke: ${SHEET_VISUALIZATION.colors.sheetBorder};
  stroke-width: ${SHEET_VISUALIZATION.strokeWidth.part};
  opacity: 0.8;
`

export const PartText = styled.text`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 10px;
  font-weight: 500;
  text-anchor: middle;
  fill: ${SHEET_VISUALIZATION.colors.partText};
  pointer-events: none;
`

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
`

export const InfoCard = styled.div`
  text-align: center;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;

  .value {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    display: block;
    margin-bottom: 4px;
  }

  .label {
    font-size: 0.75rem;
    color: #7f8c8d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
`

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #2c3e50;
`

export const EmptyStateMessage = styled.div`
  text-align: center;
  color: #7f8c8d;
  padding: 40px 20px;

  p {
    margin: 0;
    font-size: 1rem;
  }
`

export const BoldLabel = styled.span`
  font-weight: bold;
  color: #2c3e50;
`

export const UnplacedPartsContainer = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 6px;
`

export const UnplacedPartsTitle = styled.h4`
  color: #856404;
  margin: 0 0 8px 0;
`

export const UnplacedPartsList = styled.div`
  color: #856404;
  font-size: 0.9rem;
`

export const PartVisualContainer = styled.div`
  position: relative;
`
