/**
 * Card Components
 *
 * A collection of styled card components for content containers.
 */

import styled from 'styled-components'
import {
  COLORS,
  BOX_SHADOW,
  TYPOGRAPHY,
  COMPONENT_DIMENSIONS,
  SPACING,
} from '../../../utils/uiConstants'

interface CardProps {
  $variant?: 'default' | 'outlined' | 'elevated'
  $padding?: 'small' | 'medium' | 'large' | 'none'
  $noBorder?: boolean
  $fullWidth?: boolean
}

const getCardPadding = (padding: CardProps['$padding'] = 'medium') => {
  switch (padding) {
    case 'small':
      return SPACING.lg
    case 'large':
      return SPACING.xxxl
    case 'none':
      return 0
    case 'medium':
    default:
      return COMPONENT_DIMENSIONS.card.padding
  }
}

export const Card = styled.div<CardProps>`
  ${(props) => {
    const padding = getCardPadding(props.$padding)

    let boxShadow = 'none'
    let border = props.$noBorder ? 'none' : `1px solid ${COLORS.border}`

    switch (props.$variant) {
      case 'elevated':
        boxShadow = BOX_SHADOW.medium
        break
      case 'outlined':
        border = props.$noBorder ? 'none' : `1px solid ${COLORS.border}`
        break
      case 'default':
      default:
        boxShadow = BOX_SHADOW.light
        border = props.$noBorder ? 'none' : `1px solid ${COLORS.border}`
    }

    return `
      background: ${COLORS.cardBackground};
      border-radius: ${COMPONENT_DIMENSIONS.card.borderRadius}px;
      padding: ${padding}px;
      box-shadow: ${boxShadow};
      border: ${border};
      margin-bottom: ${COMPONENT_DIMENSIONS.card.marginBottom}px;
      width: ${props.$fullWidth ? '100%' : 'auto'};
    `
  }}
`

export const CardTitle = styled.h2`
  color: ${COLORS.textPrimary};
  margin-top: 0;
  margin-bottom: ${SPACING.xl}px;
  font-size: ${TYPOGRAPHY.fontSize.xl};
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${SPACING.lg}px;
  padding-bottom: ${SPACING.md}px;
  border-bottom: 1px solid ${COLORS.border};
`

export const CardBody = styled.div`
  /* Card body styles */
`

export const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${SPACING.xl}px;
  padding-top: ${SPACING.md}px;
  border-top: 1px solid ${COLORS.border};
`

// Legacy SelectableCard and SelectableItem components have been moved to SelectableItem.tsx
