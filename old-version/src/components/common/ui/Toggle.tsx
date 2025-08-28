/**
 * Toggle Component
 *
 * A toggle switch component that can be used as an alternative to checkboxes.
 */

import React from 'react'
import styled from 'styled-components'
import { COLORS, SPACING } from '../../../utils/uiConstants'

export interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  label?: string
  name?: string
  id?: string
}

interface ToggleStyleProps {
  $checked: boolean
  $disabled?: boolean
  $size?: 'small' | 'medium' | 'large'
}

const getToggleDimensions = (size: ToggleStyleProps['$size'] = 'medium') => {
  switch (size) {
    case 'small':
      return { width: 30, height: 16, circle: 12 }
    case 'large':
      return { width: 50, height: 26, circle: 22 }
    case 'medium':
    default:
      return { width: 40, height: 20, circle: 16 }
  }
}

const ToggleContainer = styled.label<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${SPACING.md}px;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  user-select: none;
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};
`

const ToggleSwitch = styled.div<ToggleStyleProps>`
  ${(props) => {
    const { width, height, circle } = getToggleDimensions(props.$size)

    return `
      position: relative;
      width: ${width}px;
      height: ${height}px;
      background-color: ${props.$checked ? COLORS.primary : COLORS.textMuted};
      border-radius: ${height}px;
      transition: background-color 0.2s ease;

      &::after {
        content: '';
        position: absolute;
        top: ${(height - circle) / 2}px;
        left: ${
          props.$checked
            ? width - circle - (height - circle) / 2
            : (height - circle) / 2
        }px;
        width: ${circle}px;
        height: ${circle}px;
        background-color: white;
        border-radius: 50%;
        transition: left 0.2s ease;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      }
    `
  }}
`

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`

const ToggleLabel = styled.span`
  font-size: 0.875rem;
  color: ${COLORS.textPrimary};
`

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'medium',
  label,
  name,
  id,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked)
    }
  }

  return (
    <ToggleContainer $disabled={disabled}>
      <HiddenCheckbox
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        name={name}
        id={id}
      />
      <ToggleSwitch
        $checked={checked}
        $disabled={disabled}
        $size={size}
      />
      {label && <ToggleLabel>{label}</ToggleLabel>}
    </ToggleContainer>
  )
}

// For use in forms with React Hook Form
export const FormToggle = React.forwardRef<
  HTMLInputElement,
  Omit<ToggleProps, 'checked' | 'onChange'> & {
    value?: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  }
>((props, ref) => {
  const [checked, setChecked] = React.useState(props.value || false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked)
    if (props.onChange) {
      props.onChange(e)
    }
  }

  React.useEffect(() => {
    if (props.value !== undefined) {
      setChecked(props.value)
    }
  }, [props.value])

  return (
    <ToggleContainer $disabled={props.disabled}>
      <HiddenCheckbox
        ref={ref}
        checked={checked}
        onChange={handleChange}
        disabled={props.disabled}
        name={props.name}
        id={props.id}
      />
      <ToggleSwitch
        $checked={checked}
        $disabled={props.disabled}
        $size={props.size}
      />
      {props.label && <ToggleLabel>{props.label}</ToggleLabel>}
    </ToggleContainer>
  )
})
