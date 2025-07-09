/**
 * Styled components for DimensionalPartForm
 */
import styled from 'styled-components'
import { InputGroup } from '../../common/ui'

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
  display: flex;
  flex-direction: column;
  justify-content: flex-end; // Align items to bottom for consistent heights
  min-height: 70px; // Ensure consistent height for all form fields

  /* For block selector, wood type selector and rotation fields */
  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(6) {
    display: flex;
    flex-direction: column;
    justify-content: flex-end; // Align all fields to bottom consistently
  }

  /* For rotation field specifically - center the toggle vertically */
  &:nth-child(6) {
    display: flex;
    flex-direction: column;

    /* The toggle container styling is now handled by ToggleWrapper */
    .toggle-container {
      display: flex;
      align-items: center;
    }
  }

  &.full-width {
    grid-column: 1 / -1;
    align-items: stretch;
  }

  /* Apply consistent styling for all inputs including selects */
  select,
  input[type='text'],
  input[type='number'] {
    width: 100%;
    height: 36px; // Consistent height for all inputs
    box-sizing: border-box;
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  /* Ensure the form fields are styled consistently with the parts list */
  .form-selector {
    width: 100%;
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.875rem;
    background-color: white;
  }
`

// Import the standardized ErrorMessage from UI component library
import { ErrorMessage as BaseErrorMessage } from '../../../components/common/ui'

// Re-export with any local customizations if needed
export const ErrorMessage = BaseErrorMessage
