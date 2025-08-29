/**
 * Tab Components
 *
 * A collection of styled tab components for tab navigation.
 */

import styled from 'styled-components'
import {
  COLORS,
  BORDER_RADIUS,
  TYPOGRAPHY,
  SPACING,
} from '../../../utils/uiConstants'

interface TabProps {
  $active?: boolean
  $disabled?: boolean
  $hasIndicator?: boolean
}

export const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const TabHeader = styled.div`
  display: flex;
  border-bottom: 1px solid ${COLORS.border};
  background: ${COLORS.hoverLight};
  border-top-left-radius: ${BORDER_RADIUS.md}px;
  border-top-right-radius: ${BORDER_RADIUS.md}px;
  overflow: hidden;
`

export const Tab = styled.button<TabProps>`
  padding: 12px 16px;
  border: none;
  background: ${(props) => (props.$active ? 'white' : 'transparent')};
  color: ${(props) => {
    if (props.$disabled) return COLORS.textMuted
    return props.$active ? COLORS.textPrimary : COLORS.textSecondary
  }};
  font-weight: ${(props) =>
    props.$active
      ? TYPOGRAPHY.fontWeight.semibold
      : TYPOGRAPHY.fontWeight.normal};
  font-size: ${TYPOGRAPHY.fontSize.sm};
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  position: relative;
  transition: all 0.2s ease;
  flex: 1;
  text-align: center;

  ${(props) =>
    props.$active &&
    `
    border-bottom: 2px solid ${COLORS.primary};
    margin-bottom: -1px;
  `}

  &:hover {
    background: ${(props) =>
      props.$disabled
        ? 'transparent'
        : props.$active
        ? 'white'
        : COLORS.hoverLight};
  }

  ${(props) =>
    props.$hasIndicator &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 10px;
      right: 10px;
      width: 8px;
      height: 8px;
      background-color: ${COLORS.primary};
      border-radius: 50%;
    }
  `}
`

export const TabContent = styled.div`
  padding: ${SPACING.xl}px;
  background: white;
  border-bottom-left-radius: ${BORDER_RADIUS.md}px;
  border-bottom-right-radius: ${BORDER_RADIUS.md}px;
  border: 1px solid ${COLORS.border};
  border-top: none;
`

export const TabPanel = styled.div<{ $active: boolean }>`
  display: ${(props) => (props.$active ? 'block' : 'none')};
`

// Legacy compatibility components
export const SheetTab = styled(Tab)`
  padding: 8px 16px;
  border: 2px solid ${COLORS.primary};
  border-radius: ${BORDER_RADIUS.md}px;
  background: ${(props) => (props.$active ? COLORS.primary : 'white')};
  color: ${(props) => (props.$active ? 'white' : COLORS.primary)};
  margin: 0 4px;

  &:hover {
    background: ${(props) =>
      props.$active ? COLORS.hoverPrimary : COLORS.hoverLight};
  }
`

export const TabButton = styled(Tab)`
  /* Legacy TabButton from VisualEnhancementEditor */
`
