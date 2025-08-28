import styled from 'styled-components'

export const FormSection = styled.div`
  margin-bottom: 20px;

  h3 {
    color: #2c3e50;
    margin-bottom: 12px;
    font-size: 1.1rem;
  }
`

export const EdgesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

import { FormGroup as BaseFormGroup } from '../../../components/common/ui'

// Re-export with custom styling for labels
export const FormGroup = styled(BaseFormGroup)`
  label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
  }

  select {
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
  }
`
