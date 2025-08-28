/**
 * Select Components
 *
 * A collection of styled select components for dropdowns.
 */

import styled from 'styled-components'
import {
  COLORS,
  BORDER_RADIUS,
  TYPOGRAPHY,
  INPUT_DIMENSIONS,
} from '../../../utils/uiConstants'

interface SelectProps {
  $hasError?: boolean
  $fullWidth?: boolean
  $size?: 'small' | 'medium' | 'large'
}

const getSelectSize = (size: SelectProps['$size'] = 'medium') => {
  switch (size) {
    case 'small':
      return {
        padding: '4px 6px',
        height: INPUT_DIMENSIONS.height.sm,
        fontSize: TYPOGRAPHY.fontSize.xs,
      }
    case 'large':
      return {
        padding: '12px 16px',
        height: INPUT_DIMENSIONS.height.lg,
        fontSize: TYPOGRAPHY.fontSize.base,
      }
    case 'medium':
    default:
      return {
        padding: '8px 12px',
        height: INPUT_DIMENSIONS.height.md,
        fontSize: TYPOGRAPHY.fontSize.sm,
      }
  }
}

export const Select = styled.select<SelectProps>`
  ${(props) => {
    const sizes = getSelectSize(props.$size)

    return `
      padding: ${sizes.padding};
      height: 36px; /* Fixed height to match inputs exactly */
      font-size: ${sizes.fontSize};
      border: 1px solid ${props.$hasError ? COLORS.danger : COLORS.borderLight};
      border-radius: ${BORDER_RADIUS.sm}px;
      width: ${props.$fullWidth ? '100%' : '100%'}; /* Always use 100% width */
      background-color: white;
      cursor: pointer;
      appearance: auto; /* Show the default dropdown icon */
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
    `
  }}
`

export const SelectLabel = styled.label`
  display: block;
  font-size: ${TYPOGRAPHY.fontSize.sm};
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
  color: ${COLORS.textPrimary};
  margin-bottom: 4px;
`

export const SelectGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  width: 100%;
`

// Removed BlockSelector and WoodTypeSelector - now defined in DomainComponents.tsx
