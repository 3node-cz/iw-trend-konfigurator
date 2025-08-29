/**
 * Input Components
 *
 * A collection of styled input components for form fields.
 */

import styled from 'styled-components'
import {
  COLORS,
  BORDER_RADIUS,
  TYPOGRAPHY,
  INPUT_DIMENSIONS,
} from '../../../utils/uiConstants'

interface InputProps {
  $hasError?: boolean
  $fullWidth?: boolean
  $size?: 'small' | 'medium' | 'large'
}

const getInputSize = (size: InputProps['$size'] = 'medium') => {
  switch (size) {
    case 'small':
      return {
        padding: INPUT_DIMENSIONS.padding.sm,
        height: INPUT_DIMENSIONS.height.sm,
        fontSize: TYPOGRAPHY.fontSize.xs,
      }
    case 'large':
      return {
        padding: INPUT_DIMENSIONS.padding.lg,
        height: INPUT_DIMENSIONS.height.lg,
        fontSize: TYPOGRAPHY.fontSize.base,
      }
    case 'medium':
    default:
      return {
        padding: INPUT_DIMENSIONS.padding.md,
        height: INPUT_DIMENSIONS.height.md,
        fontSize: TYPOGRAPHY.fontSize.sm,
      }
  }
}

export const Input = styled.input<InputProps>`
  ${(props) => {
    const sizes = getInputSize(props.$size)

    return `
      padding: ${sizes.padding};
      height: 36px; /* Fixed height to match selectors exactly */
      font-size: ${sizes.fontSize};
      border: 1px solid ${props.$hasError ? COLORS.danger : COLORS.borderLight};
      border-radius: ${BORDER_RADIUS.sm}px;
      width: 100%; /* Always use 100% width */
      box-sizing: border-box;
      background-color: white;
      appearance: textfield; /* Remove spinner arrows for number inputs in Firefox */

      /* Remove spinner arrows for number inputs in Chrome/Safari/Edge */
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      &:focus {
        outline: none;
        border-color: ${props.$hasError ? COLORS.danger : COLORS.primary};
        box-shadow: 0 0 0 2px ${
          props.$hasError ? 'rgba(231, 76, 60, 0.2)' : 'rgba(52, 152, 219, 0.2)'
        };
      }

      &:disabled {
        background-color: ${COLORS.hoverLight};
        cursor: not-allowed;
      }

      &::placeholder {
        color: ${COLORS.textMuted};
      }
    `
  }}
`

export const TextArea = styled.textarea<InputProps>`
  ${(props) => {
    const baseSizes = getInputSize(props.$size)

    return `
      padding: ${baseSizes.padding};
      font-size: ${baseSizes.fontSize};
      border: 1px solid ${props.$hasError ? COLORS.danger : COLORS.borderLight};
      border-radius: ${BORDER_RADIUS.sm}px;
      width: ${props.$fullWidth ? '100%' : 'auto'};
      min-height: ${parseInt(baseSizes.height) * 2}px;
      resize: vertical;
      box-sizing: border-box;

      &:focus {
        outline: none;
        border-color: ${props.$hasError ? COLORS.danger : COLORS.primary};
        box-shadow: 0 0 0 2px ${
          props.$hasError ? 'rgba(231, 76, 60, 0.2)' : 'rgba(52, 152, 219, 0.2)'
        };
      }

      &:disabled {
        background-color: ${COLORS.hoverLight};
        cursor: not-allowed;
      }

      &::placeholder {
        color: ${COLORS.textMuted};
      }
    `
  }}
`

export const InputLabel = styled.label`
  display: block;
  font-size: ${TYPOGRAPHY.fontSize.sm};
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
  color: ${COLORS.textPrimary};
  margin-bottom: 4px;
`

// Use FormGroup for consistent styling
import { FormGroup } from './FormGroup'
export const InputGroup = FormGroup

// Number Input with value constraints
export const NumberInput = styled(Input).attrs({ type: 'number' })`
  /* Additional number input specific styles */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
`
