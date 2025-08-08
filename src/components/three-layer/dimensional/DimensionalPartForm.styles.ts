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

  /* Full width containers that span all columns */
  .full-width {
    grid-column: 1 / -1;
    width: 100%;
  }
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 8px;

  @media (max-width: 768px) {
    justify-content: stretch;
  }
`

export const NameInputContainer = styled.div`
  flex: 1;
  max-width: 300px;
  min-width: 200px;

  @media (max-width: 768px) {
    max-width: none;
    min-width: auto;
  }
`

export const EdgeContainer = styled.div`
  grid-column: 1 / -1;
  width: 100%;
  
  /* Ensure the FormField and its children take full width */
  > * {
    width: 100%;
    
    /* Target the FormGroup inside FormField */
    > div {
      width: 100%;
      margin-bottom: 0; /* Remove default margin since we're in a grid */
      
      /* Target the EdgeFormSelector container */
      > div:last-child {
        width: 100%;
      }
    }
  }
`

export const StyledFormField = styled(InputGroup)`
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
