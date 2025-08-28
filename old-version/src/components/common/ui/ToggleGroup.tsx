/**
 * ToggleGroup Component
 *
 * A component for creating a group of toggle buttons.
 */

import React from 'react'
import styled from 'styled-components'
import { COLORS, BORDER_RADIUS, TYPOGRAPHY } from '../../../utils/uiConstants'

interface ToggleButtonProps {
  $active?: boolean
  $disabled?: boolean
  $size?: 'small' | 'medium' | 'large'
}

const getToggleButtonSize = (size: ToggleButtonProps['$size'] = 'medium') => {
  switch (size) {
    case 'small':
      return {
        padding: '4px 8px',
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

const ToggleButton = styled.button<ToggleButtonProps>`
  ${(props) => {
    const sizes = getToggleButtonSize(props.$size)

    return `
      padding: ${sizes.padding};
      font-size: ${sizes.fontSize};
      background-color: ${props.$active ? COLORS.primary : 'white'};
      color: ${props.$active ? 'white' : COLORS.textPrimary};
      border: 1px solid ${props.$active ? COLORS.primary : COLORS.border};
      cursor: ${props.$disabled ? 'not-allowed' : 'pointer'};
      transition: all 0.2s;
      opacity: ${props.$disabled ? 0.6 : 1};

      &:hover {
        background-color: ${
          props.$active ? COLORS.hoverPrimary : COLORS.hoverLight
        };
        ${!props.$active && `color: ${COLORS.textPrimary};`}
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
      }
    `
  }}
`

export const ToggleGroup = styled.div`
  display: inline-flex;
  border-radius: ${BORDER_RADIUS.sm}px;
  overflow: hidden;

  ${ToggleButton} {
    border-radius: 0;
    margin-right: -1px;

    &:first-child {
      border-top-left-radius: ${BORDER_RADIUS.sm}px;
      border-bottom-left-radius: ${BORDER_RADIUS.sm}px;
    }

    &:last-child {
      border-top-right-radius: ${BORDER_RADIUS.sm}px;
      border-bottom-right-radius: ${BORDER_RADIUS.sm}px;
      margin-right: 0;
    }
  }
`

interface ToggleProps {
  label: string
  value: string | number
  disabled?: boolean
}

interface ToggleGroupComponentProps {
  value: string | number
  onChange: (value: string | number) => void
  options: ToggleProps[]
  size?: ToggleButtonProps['$size']
  disabled?: boolean
}

export const ToggleGroupComponent: React.FC<ToggleGroupComponentProps> = ({
  value,
  onChange,
  options,
  size = 'medium',
  disabled = false,
}) => {
  return (
    <ToggleGroup>
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          type="button"
          onClick={() =>
            !disabled && !option.disabled && onChange(option.value)
          }
          $active={value === option.value}
          $disabled={disabled || option.disabled}
          $size={size}
          aria-pressed={value === option.value}
        >
          {option.label}
        </ToggleButton>
      ))}
    </ToggleGroup>
  )
}
