/**
 * Badge Component
 *
 * A component for displaying badges, indicators, and tags.
 */

import styled from 'styled-components'
import { COLORS, BORDER_RADIUS, SPACING } from '../../../utils/uiConstants'

interface BadgeProps {
  $color?: string
  $variant?: 'filled' | 'outlined'
  $size?: 'small' | 'medium' | 'large'
  $shape?: 'rounded' | 'pill' | 'square' | 'circle'
}

const getBadgeSize = (size: BadgeProps['$size'] = 'medium') => {
  switch (size) {
    case 'small':
      return {
        padding: `${SPACING.xs}px ${SPACING.sm}px`,
        fontSize: '0.75rem',
        minSize: 16,
      }
    case 'large':
      return {
        padding: `${SPACING.sm}px ${SPACING.lg}px`,
        fontSize: '1rem',
        minSize: 32,
      }
    case 'medium':
    default:
      return {
        padding: `${SPACING.sm}px ${SPACING.md}px`,
        fontSize: '0.875rem',
        minSize: 24,
      }
  }
}

const getBadgeRadius = (shape: BadgeProps['$shape'] = 'rounded') => {
  switch (shape) {
    case 'pill':
      return '9999px'
    case 'square':
      return '0'
    case 'circle':
      return '50%'
    case 'rounded':
    default:
      return `${BORDER_RADIUS.sm}px`
  }
}

export const Badge = styled.span<BadgeProps>`
  ${(props) => {
    const sizes = getBadgeSize(props.$size)
    const radius = getBadgeRadius(props.$shape)
    const bgColor = props.$color || COLORS.primary
    const textColor = props.$variant === 'outlined' ? bgColor : '#fff'

    return `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: ${sizes.padding};
      font-size: ${sizes.fontSize};
      border-radius: ${radius};
      background-color: ${
        props.$variant === 'outlined' ? 'transparent' : bgColor
      };
      color: ${textColor};
      border: ${
        props.$variant === 'outlined' ? `1px solid ${bgColor}` : 'none'
      };
      font-weight: 500;

      ${
        props.$shape === 'circle' &&
        `
        width: ${sizes.minSize}px;
        height: ${sizes.minSize}px;
      `
      }
    `
  }}
`

export const ColorIndicator = styled.div<{
  $color: string
  $size?: 'small' | 'medium' | 'large'
}>`
  ${(props) => {
    const size =
      props.$size === 'small' ? 14 : props.$size === 'large' ? 20 : 16
    return `
      width: ${size}px;
      height: ${size}px;
      border-radius: 3px;
      background-color: ${props.$color || COLORS.primary};
      display: inline-block;
      margin-right: ${SPACING.md}px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      flex-shrink: 0;
    `
  }}
`

export const StatusBadge = styled(Badge).attrs({
  $shape: 'pill',
  $size: 'small',
})<{ $status: 'success' | 'warning' | 'error' | 'info' | 'neutral' }>`
  ${(props) => {
    const getStatusColor = () => {
      switch (props.$status) {
        case 'success':
          return COLORS.success
        case 'warning':
          return COLORS.warning
        case 'error':
          return COLORS.danger
        case 'info':
          return COLORS.info
        case 'neutral':
        default:
          return COLORS.textMuted
      }
    }

    return `
      background-color: ${
        props.$variant === 'outlined' ? 'transparent' : getStatusColor()
      };
      color: ${props.$variant === 'outlined' ? getStatusColor() : '#fff'};
      border: ${
        props.$variant === 'outlined' ? `1px solid ${getStatusColor()}` : 'none'
      };
    `
  }}
`

export const CountBadge = styled.div<{ $count: number }>`
  background-color: ${COLORS.textMuted};
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  padding: 2px 6px;
  min-width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;

  ${(props) =>
    props.$count > 0 &&
    `
    background-color: ${COLORS.primary};
  `}
`
