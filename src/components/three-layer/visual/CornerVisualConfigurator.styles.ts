/**
 * Styled components for CornerVisualConfigurator
 */
import styled from 'styled-components'

export const FormSection = styled.div`
  margin-bottom: 20px;

  h3 {
    color: #2c3e50;
    margin-bottom: 12px;
    font-size: 1.1rem;
  }
`

export const CornersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const CornerSection = styled.div`
  background: #f8f9fa;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  padding: 16px;

  h4 {
    color: #2c3e50;
    margin-bottom: 12px;
    font-size: 0.9rem;
    font-weight: 600;
  }
`

export const FormGroup = styled.div`
  margin-bottom: 12px;

  label {
    display: block;
    margin-bottom: 4px;
    color: #495057;
    font-weight: 500;
    font-size: 0.85rem;
  }

  select,
  input {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 0.85rem;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
  }

  &:last-child {
    margin-bottom: 0;
  }
`
