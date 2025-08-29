/**
 * Styled components for VisualEnhancementEditor
 */
import styled from 'styled-components'

export const TabContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
  margin-bottom: 20px;
  overflow: hidden;
`

export const TabHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #e1e8ed;
  background: #f8f9fa;
`

export const TabButton = styled.button<{
  $active: boolean
  $hasConfig?: boolean
}>`
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: ${(props) => (props.$active ? 'white' : 'transparent')};
  color: ${(props) => (props.$active ? '#2c3e50' : '#7f8c8d')};
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  font-size: 0.9rem;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$active ? 'white' : '#e9ecef')};
    color: #2c3e50;
  }

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: -2px;
    z-index: 1;
  }

  ${(props) =>
    props.$hasConfig &&
    `
    &::after {
      content: '●';
      position: absolute;
      top: 4px;
      right: 8px;
      color: #28a745;
      font-size: 0.7rem;
    }
  `}
`

export const TabContent = styled.div`
  padding: 20px;
`

export const ConfigurationSelector = styled.div`
  background: #f8f9fa;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
`

export const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #2c3e50;

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`

export const WarningText = styled.div`
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 8px;
  font-style: italic;
`

export const EmptyState = styled.div`
  text-align: center;
  color: #999;
  padding: 40px 20px;
  font-style: italic;
`

export const SpacedDiv = styled.div<{ $marginTop?: number }>`
  margin-top: ${(props) => props.$marginTop || 0}px;
`
