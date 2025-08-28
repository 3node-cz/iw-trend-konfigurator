/**
 * Tooltip Component
 *
 * A component for displaying tooltips and hover information.
 */

import styled from 'styled-components'
import {
  BORDER_RADIUS,
  BOX_SHADOW,
  SPACING,
  Z_INDEX,
} from '../../../utils/uiConstants'

interface TooltipProps {
  $visible?: boolean
  $position?: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip = styled.div<TooltipProps>`
  position: absolute;
  background-color: #333;
  color: #fff;
  padding: ${SPACING.sm}px ${SPACING.md}px;
  border-radius: ${BORDER_RADIUS.sm}px;
  font-size: 0.75rem;
  font-weight: 400;
  z-index: ${Z_INDEX.tooltip};
  box-shadow: ${BOX_SHADOW.light};
  white-space: nowrap;
  pointer-events: none;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  visibility: ${(props) => (props.$visible ? 'visible' : 'hidden')};
  transition: opacity 0.2s ease, visibility 0.2s ease;
  max-width: 250px;

  ${(props) => {
    switch (props.$position) {
      case 'bottom':
        return `
          top: calc(100% + 5px);
          left: 50%;
          transform: translateX(-50%);
        `
      case 'left':
        return `
          right: calc(100% + 5px);
          top: 50%;
          transform: translateY(-50%);
        `
      case 'right':
        return `
          left: calc(100% + 5px);
          top: 50%;
          transform: translateY(-50%);
        `
      case 'top':
      default:
        return `
          bottom: calc(100% + 5px);
          left: 50%;
          transform: translateX(-50%);
        `
    }
  }}
`

export const RelativeContainer = styled.div`
  position: relative;
  display: inline-flex;
`
