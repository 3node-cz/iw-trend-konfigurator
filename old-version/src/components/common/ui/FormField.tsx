/**
 * FormField Component
 *
 * A component that wraps an input with a label, optional error message, and hint text.
 */

import React from 'react'
import type { ReactNode } from 'react'
import styled from 'styled-components'
import { COLORS, SPACING, TYPOGRAPHY } from '../../../utils/uiConstants'
import { FormGroup } from './FormGroup'

interface FormFieldProps {
  label: string
  htmlFor?: string
  children: ReactNode
  error?: string
  hint?: string
  required?: boolean
}

// Using our standard FormGroup as the container

const StyledLabel = styled.label<{ $hasError?: boolean; $required?: boolean }>`
  font-size: ${TYPOGRAPHY.fontSize.sm};
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
  color: ${(props) => (props.$hasError ? COLORS.danger : COLORS.textPrimary)};

  ${(props) =>
    props.$required &&
    `
    &::after {
      content: "*";
      color: ${COLORS.danger};
      margin-left: 4px;
    }
  `}
`

export const ErrorMessage = styled.div`
  color: ${COLORS.danger};
  font-size: ${TYPOGRAPHY.fontSize.xs};
  margin-top: ${SPACING.sm}px;
`

export const HintText = styled.div`
  color: ${COLORS.textSecondary};
  font-size: ${TYPOGRAPHY.fontSize.xs};
  margin-top: ${SPACING.sm}px;
`

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  children,
  error,
  hint,
  required,
}) => {
  return (
    <FormGroup>
      <StyledLabel
        htmlFor={htmlFor}
        $hasError={!!error}
        $required={required}
      >
        {label}
      </StyledLabel>

      {children}

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {hint && !error && <HintText>{hint}</HintText>}
    </FormGroup>
  )
}
