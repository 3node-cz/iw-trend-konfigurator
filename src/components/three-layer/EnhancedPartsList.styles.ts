/**
 * Styled components for EnhancedPartsList
 */
import styled from 'styled-components'
import { SelectableItem } from '../common/CommonStyles'

export const PartItem = styled(SelectableItem)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto auto auto;
  gap: 12px;
  align-items: center;
`

export const PartInfo = styled.div`
  .label {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 2px;
  }

  .dimensions {
    font-size: 0.8rem;
    color: #7f8c8d;
  }
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
