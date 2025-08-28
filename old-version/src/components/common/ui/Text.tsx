/**
 * Text Components
 *
 * A collection of typography components for consistent text styling.
 */

import styled from 'styled-components'
import { COLORS, TYPOGRAPHY } from '../../../utils/uiConstants'

interface TextProps {
  $variant?:
    | 'normal'
    | 'title'
    | 'subtitle'
    | 'caption'
    | 'label'
    | 'info'
    | 'detail'
    | 'error'
    | 'success'
  $size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
  $weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  $align?: 'left' | 'center' | 'right'
  $color?: string
  $truncate?: boolean
  $uppercase?: boolean
}

const getTextColor = (
  variant: TextProps['$variant'] = 'normal',
  color?: string,
) => {
  if (color) return color

  switch (variant) {
    case 'title':
    case 'subtitle':
      return COLORS.textPrimary
    case 'caption':
    case 'info':
      return COLORS.textSecondary
    case 'detail':
      return COLORS.textMuted
    case 'label':
      return COLORS.textPrimary
    case 'error':
      return COLORS.danger
    case 'success':
      return COLORS.success
    case 'normal':
    default:
      return COLORS.textPrimary
  }
}

const getFontSize = (
  variant: TextProps['$variant'] = 'normal',
  size?: TextProps['$size'],
) => {
  if (size) return TYPOGRAPHY.fontSize[size]

  switch (variant) {
    case 'title':
      return TYPOGRAPHY.fontSize['2xl']
    case 'subtitle':
      return TYPOGRAPHY.fontSize.lg
    case 'caption':
    case 'info':
      return TYPOGRAPHY.fontSize.sm
    case 'detail':
    case 'label':
      return TYPOGRAPHY.fontSize.xs
    case 'normal':
    default:
      return TYPOGRAPHY.fontSize.base
  }
}

const getFontWeight = (
  variant: TextProps['$variant'] = 'normal',
  weight?: TextProps['$weight'],
) => {
  if (weight) return TYPOGRAPHY.fontWeight[weight]

  switch (variant) {
    case 'title':
    case 'label':
      return TYPOGRAPHY.fontWeight.semibold
    case 'subtitle':
      return TYPOGRAPHY.fontWeight.medium
    case 'normal':
    case 'caption':
    case 'info':
    case 'detail':
    default:
      return TYPOGRAPHY.fontWeight.normal
  }
}

export const Text = styled.span<TextProps>`
  color: ${(props) => getTextColor(props.$variant, props.$color)};
  font-size: ${(props) => getFontSize(props.$variant, props.$size)};
  font-weight: ${(props) => getFontWeight(props.$variant, props.$weight)};
  text-align: ${(props) => props.$align || 'left'};
  ${(props) =>
    props.$truncate &&
    `
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  `}
  ${(props) => props.$uppercase && 'text-transform: uppercase;'}
`

export const Title = styled(Text).attrs({ $variant: 'title' })<TextProps>`
  display: block;
  margin-bottom: 12px;
`

export const Subtitle = styled(Text).attrs({ $variant: 'subtitle' })<TextProps>`
  display: block;
  margin-bottom: 8px;
`

export const Caption = styled(Text).attrs({ $variant: 'caption' })<TextProps>``

export const InfoText = styled(Text).attrs({ $variant: 'info' })<TextProps>``

export const DetailText = styled(Text).attrs({
  $variant: 'detail',
})<TextProps>``

export const LabelText = styled(Text).attrs({ $variant: 'label' })<TextProps>``

export const ErrorText = styled(Text).attrs({ $variant: 'error' })<TextProps>``

export const SuccessText = styled(Text).attrs({
  $variant: 'success',
})<TextProps>``

export const DimensionsHeader = styled(Title)`
  font-size: ${TYPOGRAPHY.fontSize.lg};
  margin-top: 16px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${COLORS.border};
`
