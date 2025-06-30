/**
 * Styled components for DimensionalPartForm
 */
import styled from 'styled-components'
import { InputGroup } from '../../common/CommonStyles'

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const FormField = styled(InputGroup)`
  &.full-width {
    grid-column: 1 / -1;
  }
`

export const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 2px;
`
