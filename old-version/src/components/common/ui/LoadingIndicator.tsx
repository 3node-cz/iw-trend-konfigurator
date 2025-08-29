/**
 * LoadingIndicator Component
 *
 * A component for displaying loading states, spinners, and loading animations.
 */

import React from 'react'
import styled, { keyframes } from 'styled-components'
import {
  COLORS,
  SPACING,
  Z_INDEX,
  TYPOGRAPHY,
} from '../../../utils/uiConstants'

// Keyframe animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const dots = keyframes`
  0%, 20% {
    color: rgba(0,0,0,0);
    text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0);
  }
  40% {
    color: ${COLORS.textMuted};
    text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0);
  }
  60% {
    text-shadow: .25em 0 0 ${COLORS.textMuted}, .5em 0 0 rgba(0,0,0,0);
  }
  80%, 100% {
    text-shadow: .25em 0 0 ${COLORS.textMuted}, .5em 0 0 ${COLORS.textMuted};
  }
`

// Spinner sizes
interface SpinnerProps {
  $size?: 'small' | 'medium' | 'large'
  $color?: string
}

const getSpinnerSize = (size: SpinnerProps['$size'] = 'medium') => {
  switch (size) {
    case 'small':
      return { size: 16, borderWidth: 2 }
    case 'large':
      return { size: 32, borderWidth: 4 }
    case 'medium':
    default:
      return { size: 24, borderWidth: 3 }
  }
}

// Spinner component
export const Spinner = styled.div<SpinnerProps>`
  ${(props) => {
    const dimensions = getSpinnerSize(props.$size)
    const color = props.$color || COLORS.primary

    return `
      display: inline-block;
      width: ${dimensions.size}px;
      height: ${dimensions.size}px;
      border: ${dimensions.borderWidth}px solid ${COLORS.borderLight};
      border-top: ${dimensions.borderWidth}px solid ${color};
      border-radius: 50%;
      animation: ${spin} 1s linear infinite;
    `
  }}
`

// Loading container props
interface LoadingContainerProps {
  $overlay?: boolean
  $transparent?: boolean
  $padding?: boolean
}

// Loading container variants
export const LoadingContainer = styled.div<LoadingContainerProps>`
  ${(props) =>
    props.$overlay
      ? `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${
      props.$transparent ? 'rgba(255, 255, 255, 0.7)' : COLORS.cardBackground
    };
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: ${Z_INDEX.modal};
    border-radius: 4px;
  `
      : `
    display: flex;
    align-items: center;
    padding: ${
      props.$padding !== false ? `${SPACING.md}px ${SPACING.lg}px` : '0'
    };
    background-color: ${props.$transparent ? 'transparent' : COLORS.background};
    border: ${props.$transparent ? 'none' : `1px solid ${COLORS.border}`};
    border-radius: 4px;
    color: ${COLORS.textSecondary};
    font-size: ${TYPOGRAPHY.fontSize.sm};
  `}
`

// Loading message
export const LoadingMessage = styled.span`
  font-size: ${TYPOGRAPHY.fontSize.sm};
  color: ${COLORS.textSecondary};
  margin-left: ${SPACING.md}px;
`

// Loading dots component
export const LoadingDotsContainer = styled.span`
  display: inline-block;
  font-size: ${TYPOGRAPHY.fontSize.sm};
  color: ${COLORS.textMuted};
  margin-left: ${SPACING.sm}px;

  &:after {
    content: '...';
    animation: ${dots} 1.5s steps(4, end) infinite;
  }
`

// React components
interface LoadingIndicatorProps {
  isLoading?: boolean
  message?: string
  overlay?: boolean
  transparent?: boolean
  size?: 'small' | 'medium' | 'large'
  color?: string
  noPadding?: boolean
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  isLoading = true,
  message = 'Loading...',
  overlay = false,
  transparent = false,
  size = 'medium',
  color,
  noPadding = false,
}) => {
  if (!isLoading) return null

  return (
    <LoadingContainer
      $overlay={overlay}
      $transparent={transparent}
      $padding={!noPadding}
    >
      <Spinner
        $size={size}
        $color={color}
      />
      {message && <LoadingMessage>{message}</LoadingMessage>}
    </LoadingContainer>
  )
}

// Lightweight loading dots for inline use
export const LoadingDots: React.FC<{ isLoading?: boolean }> = ({
  isLoading = true,
}) => {
  if (!isLoading) return null
  return <LoadingDotsContainer />
}
