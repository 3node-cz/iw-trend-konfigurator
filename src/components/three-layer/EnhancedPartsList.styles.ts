/**
 * Styled components for EnhancedPartsList
 */
import styled from 'styled-components'
import { SelectableItem, ColorIndicator } from '../common/ui'
import { BREAKPOINTS } from '../../utils/uiConstants'

// Re-export the ColorIndicator from UI components
export { ColorIndicator }

export const PartItem = styled(SelectableItem)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto auto auto auto auto;
  gap: 12px;
  align-items: center;
`

export const PartCard = styled(SelectableItem)`
  padding: 16px;
  border-radius: 8px;
  background: white;
  border: 2px solid #e1e8ed;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s ease;
  position: relative;
  min-height: 160px; /* Ensure consistent card height */
  cursor: pointer;

  &:hover {
    border-color: #3498db;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.15);
    transform: translateY(-2px);
  }

  ${({ $selected }) =>
    $selected &&
    `
    border-color: #3498db;
    background: #f8fbff;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
  `}
`

export const PartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const PartTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2px;
  line-height: 1.3;
`

export const PartDimensions = styled.div`
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 4px;
  font-weight: 500;
`

export const PartMetrics = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
`

export const PartMetric = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;

  .value {
    font-size: 1rem;
    font-weight: 600;
    color: #2c3e50;
    line-height: 1.2;
  }

  .label {
    font-size: 0.75rem;
    color: #6c757d;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
`

export const PartControls = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;

  /* Ensure consistent width for all child elements */
  > * {
    min-width: 0; /* Allow shrinking */
  }

  /* Special handling for selectors to ensure consistent sizing */
  select {
    width: 100%;
    height: 32px;
    box-sizing: border-box;
  }

  @media (max-width: ${BREAKPOINTS.tablet}) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`

export const PartActions = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #e8f4fd 0%, #f0f8ff 100%);
  border-radius: 8px;
  border: 1px solid #d6ebf7;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`

export const Stat = styled.div`
  text-align: center;
  padding: 8px;

  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    line-height: 1.2;
  }

  .label {
    font-size: 0.75rem;
    color: #5a6c7d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 4px;
    font-weight: 500;
  }
`

// Local components for backwards compatibility

// Create local definitions instead since we're having issues with imports
// These will be removed once all files have been updated to use the UI components directly
const RelativeContainerBase = styled.div`
  position: relative;
`

const ConfigTooltipBase = styled.div<{ $visible?: boolean }>`
  position: absolute;
  background-color: #333;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 400;
  z-index: 2000;
  white-space: nowrap;
  pointer-events: none;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  visibility: ${(props) => (props.$visible ? 'visible' : 'hidden')};
  transition: opacity 0.2s ease, visibility 0.2s ease;
`

// For type safety
type ConfigBadgeType = 'corners' | 'edges' | 'lshape' | 'frame'

// For backwards compatibility while we transition references
export const ConfigIndicators = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`

// Recreate original ConfigBadge for backwards compatibility
export const ConfigBadge = styled.span<{
  $type: ConfigBadgeType
}>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  color: white;
  cursor: help;

  background: ${(props) => {
    switch (props.$type) {
      case 'corners':
        return '#28a745'
      case 'edges':
        return '#007bff'
      case 'lshape':
        return '#ffc107'
      case 'frame':
        return '#6f42c1'
      default:
        return '#6c757d'
    }
  }};

  color: ${(props) => (props.$type === 'lshape' ? '#000' : '#fff')};
`

export const ConfigTooltip = styled(ConfigTooltipBase)<{ $visible: boolean }>`
  transform: translateY(-100%);
  margin-top: -8px;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #333;
  }
`

export const RelativeContainer = RelativeContainerBase

export const NoDataSpan = styled.span`
  font-size: 0.7rem;
  color: #bdc3c7;
`

export const SpacedContainer = styled.div<{ $marginTop?: number }>`
  margin-top: ${(props) => props.$marginTop || 0}px;
`

export const BlockSelectorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const BlockValidationError = styled.div`
  background: #fee;
  color: #c33;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-top: 4px;
  border: 1px solid #fcc;
`

export const BlockControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  /* Ensure the selector takes full width */
  select {
    flex: 1;
    min-width: 0;
  }
`

// These components have been moved to DomainComponents.tsx
// Re-exporting them to maintain compatibility with existing code
import { BlockSelector, WoodTypeSelector, RotationToggle } from '../common/ui'
export { BlockSelector, WoodTypeSelector, RotationToggle }

export const BlockIndicator = styled.div<{ $blockId: number; $color?: string }>`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ $color, $blockId }) => {
    if ($color) return $color
    // Fallback to blockId-based color if no color provided
    const colors = [
      '#3498db',
      '#e74c3c',
      '#2ecc71',
      '#f39c12',
      '#9b59b6',
      '#1abc9c',
      '#34495e',
      '#e67e22',
    ]
    return colors[$blockId % colors.length]
  }};
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

// ColorIndicator is now imported from the UI components library
