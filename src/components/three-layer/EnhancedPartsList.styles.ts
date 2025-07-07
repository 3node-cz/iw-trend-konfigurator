/**
 * Styled components for EnhancedPartsList
 */
import styled from 'styled-components'
import { SelectableItem } from '../common/CommonStyles'

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
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3498db;
  }

  ${({ $selected }) =>
    $selected &&
    `
    border-color: #3498db;
    background: #f8fbff;
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
  margin-bottom: 4px;
`

export const PartDimensions = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 8px;
`

export const PartMetrics = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  margin-bottom: 8px;
`

export const PartMetric = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;

  .value {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
  }

  .label {
    font-size: 0.8rem;
    color: #7f8c8d;
  }
`

export const PartControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`

export const PartActions = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: #e8f4fd;
  border-radius: 6px;
`

export const Stat = styled.div`
  text-align: center;

  .value {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2c3e50;
  }

  .label {
    font-size: 0.7rem;
    color: #7f8c8d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
  }
`

export const ConfigIndicators = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`

export const ConfigBadge = styled.span<{
  $type: 'corners' | 'edges' | 'lshape'
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
      default:
        return '#6c757d'
    }
  }};

  color: ${(props) => (props.$type === 'lshape' ? '#000' : '#fff')};
`

export const ConfigTooltip = styled.div<{ $visible: boolean }>`
  position: absolute;
  background: #2c3e50;
  color: white;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  white-space: nowrap;
  z-index: 1000;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  visibility: ${(props) => (props.$visible ? 'visible' : 'hidden')};
  transition: opacity 0.2s, visibility 0.2s;
  transform: translateY(-100%);
  margin-top: -8px;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #2c3e50;
  }
`

export const RelativeContainer = styled.div`
  position: relative;
`

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
`

export const BlockSelector = styled.select`
  padding: 4px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.8rem;
  background: white;
  min-width: 90px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`

export const RotationLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  cursor: pointer;

  input {
    margin: 0;
  }
`

export const BlockIndicator = styled.div<{ $blockId: number }>`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ $blockId }) => {
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
