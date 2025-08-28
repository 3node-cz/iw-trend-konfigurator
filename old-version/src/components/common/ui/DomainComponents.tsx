/**
 * Domain-Specific UI Components
 *
 * These are specialized UI components for the specific domain of the application.
 * They build upon the basic UI components but add domain-specific functionality.
 */

import React from 'react'
import styled from 'styled-components'
import { COLORS, SPACING } from '../../../utils/uiConstants'
import { Select } from './Select'
import { Toggle } from './Toggle'

// --- Block Selection Components ---

export const BlockControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.md}px;
`

export const BlockValidationError = styled.div`
  background: #fee;
  color: ${COLORS.danger};
  padding: ${SPACING.md}px ${SPACING.lg}px;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-top: ${SPACING.sm}px;
  border: 1px solid #fcc;
`

export const BlockSelector = styled(Select).attrs({ $size: 'small' })`
  min-width: 90px;
  height: 36px !important; /* Match the input height exactly */
  padding: 4px 8px;

  &:focus {
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`

// --- Wood Type Selection Components ---

export const WoodTypeSelector = styled(Select).attrs({ $size: 'small' })`
  min-width: 80px;
  height: 36px !important; /* Match the input height exactly */
  padding: 4px 8px;

  &:focus {
    border-color: ${COLORS.success};
    box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.2);
  }
`

// --- Rotation Components ---

// Legacy checkbox-based rotation component
export const RotationLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${SPACING.sm}px;
  font-size: 0.8rem;
  cursor: pointer;

  input {
    margin: 0;
  }
`

interface RotationToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

// Modern toggle-based rotation component
export const RotationToggle: React.FC<RotationToggleProps> = ({
  checked,
  onChange,
  disabled,
}) => {
  return (
    <Toggle
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      size="small"
      label="Rotácia"
    />
  )
}
