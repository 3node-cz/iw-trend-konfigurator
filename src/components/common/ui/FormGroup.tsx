/**
 * FormGroup Component
 *
 * A generic container for form fields and controls.
 */

import styled from 'styled-components'
import { SPACING } from '../../../utils/uiConstants'

interface FormGroupProps {
  $gap?: number
  $marginBottom?: number
  $direction?: 'row' | 'column'
}

export const FormGroup = styled.div<FormGroupProps>`
  display: flex;
  flex-direction: ${(props) => props.$direction || 'column'};
  gap: ${(props) =>
    props.$gap !== undefined ? `${props.$gap}px` : `${SPACING.md}px`};
  margin-bottom: ${(props) =>
    props.$marginBottom !== undefined
      ? `${props.$marginBottom}px`
      : `${SPACING.lg}px`};
`
