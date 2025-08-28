/**
 * SelectableItem Component
 *
 * A component for creating selectable items in lists or grids.
 */

import styled from 'styled-components'
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  BOX_SHADOW,
} from '../../../utils/uiConstants'

interface SelectableItemProps {
  $selected?: boolean
  $interactive?: boolean
  $border?: boolean
}

export const SelectableItem = styled.div<SelectableItemProps>`
  padding: ${SPACING.lg}px;
  background: ${(props) =>
    props.$selected ? '#e8f4fd' : COLORS.cardBackground};
  border-radius: ${BORDER_RADIUS.md}px;

  ${(props) =>
    props.$interactive &&
    `
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: ${props.$selected ? '#d3eafc' : COLORS.hoverLight};
      transform: translateY(-1px);
      box-shadow: ${BOX_SHADOW.medium};
    }

    &:active {
      transform: translateY(0);
    }
  `}

  ${(props) =>
    props.$border &&
    `
    border: 1px solid ${props.$selected ? COLORS.primary : COLORS.border};
  `}
`

export const SelectableCard = styled(SelectableItem)`
  box-shadow: ${(props) =>
    props.$selected ? BOX_SHADOW.medium : BOX_SHADOW.light};
  border: 1px solid
    ${(props) => (props.$selected ? COLORS.primary : COLORS.border)};
  margin-bottom: ${SPACING.md}px;
`

export const SelectableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${SPACING.lg}px;
`

export const SelectableList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.md}px;
`
