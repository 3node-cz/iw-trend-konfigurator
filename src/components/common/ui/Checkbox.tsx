/**
 * Checkbox Components
 *
 * A collection of styled checkbox components.
 */

import styled from 'styled-components'
import { COLORS, TYPOGRAPHY } from '../../../utils/uiConstants'

export interface CheckboxProps {
  $hasError?: boolean
}

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`

export const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
  pointer-events: none;
`

export const StyledCheckbox = styled.div<{
  $checked: boolean
  $disabled?: boolean
  $hasError?: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: ${(props) => (props.$checked ? COLORS.primary : 'white')};
  border: 1px solid
    ${(props) => {
      if (props.$hasError) return COLORS.danger
      if (props.$checked) return COLORS.primary
      return COLORS.borderLight
    }};
  border-radius: 3px;
  transition: all 150ms;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};

  &:hover {
    border-color: ${(props) =>
      props.$disabled ? COLORS.borderLight : COLORS.primary};
  }

  &::after {
    content: '';
    display: ${(props) => (props.$checked ? 'block' : 'none')};
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    margin-bottom: 2px;
  }
`

export const CheckboxLabel = styled.label<{ $disabled?: boolean }>`
  padding-left: 8px;
  font-size: ${TYPOGRAPHY.fontSize.sm};
  color: ${(props) =>
    props.$disabled ? COLORS.textMuted : COLORS.textPrimary};
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
`

// Custom Checkbox Component
export const Checkbox = ({
  id,
  label,
  checked = false,
  disabled = false,
  hasError = false,
  onChange,
  ...props
}: {
  id?: string
  label?: string
  checked?: boolean
  disabled?: boolean
  hasError?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  [key: string]: any
}) => {
  return (
    <CheckboxContainer>
      <HiddenCheckbox
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        {...props}
      />
      <StyledCheckbox
        $checked={checked}
        $disabled={disabled}
        $hasError={hasError}
      />
      {label && (
        <CheckboxLabel
          htmlFor={id}
          $disabled={disabled}
        >
          {label}
        </CheckboxLabel>
      )}
    </CheckboxContainer>
  )
}

// Removed RotationLabel - now defined in DomainComponents.tsx
