/**
 * Button Components
 *
 * A collection of styled button components for various use cases.
 */

import styled from 'styled-components'
import {
  COLORS,
  BORDER_RADIUS,
  TYPOGRAPHY,
  COMPONENT_DIMENSIONS,
} from '../../../utils/uiConstants'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  fullWidth?: boolean
}

const getButtonColors = (
  variant: ButtonProps['variant'] = 'primary',
  disabled?: boolean,
) => {
  if (disabled) {
    return {
      bg: COLORS.textMuted,
      color: 'white',
      border: COLORS.textMuted,
      hoverBg: COLORS.textMuted,
    }
  }

  switch (variant) {
    case 'primary':
      return {
        bg: COLORS.primary,
        color: 'white',
        border: COLORS.primary,
        hoverBg: COLORS.hoverPrimary,
      }
    case 'secondary':
      return {
        bg: COLORS.textMuted,
        color: 'white',
        border: COLORS.textMuted,
        hoverBg: COLORS.textSecondary,
      }
    case 'danger':
      return {
        bg: COLORS.danger,
        color: 'white',
        border: COLORS.danger,
        hoverBg: '#c0392b',
      }
    case 'success':
      return {
        bg: COLORS.success,
        color: 'white',
        border: COLORS.success,
        hoverBg: '#219653',
      }
    case 'ghost':
      return {
        bg: 'transparent',
        color: COLORS.textPrimary,
        border: COLORS.border,
        hoverBg: COLORS.hoverLight,
      }
    default:
      return {
        bg: COLORS.primary,
        color: 'white',
        border: COLORS.primary,
        hoverBg: COLORS.hoverPrimary,
      }
  }
}

const getButtonSize = (size: ButtonProps['size'] = 'medium') => {
  switch (size) {
    case 'small':
      return {
        padding: COMPONENT_DIMENSIONS.button.padding,
        fontSize: TYPOGRAPHY.fontSize.xs,
      }
    case 'large':
      return {
        padding: '12px 24px',
        fontSize: TYPOGRAPHY.fontSize.base,
      }
    case 'medium':
    default:
      return {
        padding: '8px 16px',
        fontSize: TYPOGRAPHY.fontSize.sm,
      }
  }
}

export const Button = styled.button<ButtonProps>`
  ${(props) => {
    const colors = getButtonColors(props.variant, props.disabled)
    const sizes = getButtonSize(props.size)

    return `
      background-color: ${colors.bg};
      color: ${colors.color};
      border: 1px solid ${colors.border};
      border-radius: ${BORDER_RADIUS.sm}px;
      padding: ${sizes.padding};
      font-size: ${sizes.fontSize};
      font-weight: ${TYPOGRAPHY.fontWeight.semibold};
      cursor: ${props.disabled ? 'not-allowed' : 'pointer'};
      transition: background-color 0.2s, transform 0.1s;
      display: inline-block;
      text-align: center;
      width: ${props.fullWidth ? '100%' : 'auto'};

      &:hover {
        background-color: ${props.disabled ? colors.bg : colors.hoverBg};
        ${!props.disabled && 'transform: translateY(-1px);'}
      }

      &:active {
        ${!props.disabled && 'transform: translateY(0px);'}
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
      }
    `
  }}
`

// Re-export existing buttons as deprecated variants with warnings
// to ease migration from old to new component API

export const PrimaryButton = styled(Button).attrs({ variant: 'primary' })`
  /* Legacy component, use Button variant="primary" instead */
`

export const SecondaryButton = styled(Button).attrs({ variant: 'secondary' })`
  /* Legacy component, use Button variant="secondary" instead */
`

export const DangerButton = styled(Button).attrs({ variant: 'danger' })`
  /* Legacy component, use Button variant="danger" instead */
`

export const SmallButton = styled(Button).attrs({
  variant: 'primary',
  size: 'small',
})`
  /* Legacy component, use Button variant="primary" size="small" instead */
`
