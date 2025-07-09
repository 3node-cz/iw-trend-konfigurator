/**
 * Grid Components
 *
 * A collection of grid layout components for responsive designs.
 */

import styled from 'styled-components'
import { SPACING, BREAKPOINTS } from '../../../utils/uiConstants'

interface GridProps {
  $columns?: number | string
  $gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  $alignItems?: 'start' | 'center' | 'end' | 'stretch'
  $justifyContent?:
    | 'start'
    | 'center'
    | 'end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
}

const getGapSize = (size: GridProps['$gap'] = 'md') => {
  switch (size) {
    case 'xs':
      return SPACING.xs
    case 'sm':
      return SPACING.sm
    case 'lg':
      return SPACING.lg
    case 'xl':
      return SPACING.xl
    case 'xxl':
      return SPACING.xxl
    case 'md':
    default:
      return SPACING.md
  }
}

export const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: ${(props) => {
    if (typeof props.$columns === 'number') {
      return `repeat(${props.$columns}, 1fr)`
    }
    if (typeof props.$columns === 'string') {
      return props.$columns
    }
    return 'repeat(auto-fill, minmax(200px, 1fr))'
  }};
  gap: ${(props) => getGapSize(props.$gap)}px;
  align-items: ${(props) => props.$alignItems || 'stretch'};
  justify-content: ${(props) => props.$justifyContent || 'start'};
`

export const Row = styled.div<{
  $gap?: GridProps['$gap']
  $alignItems?: GridProps['$alignItems']
  $justifyContent?: GridProps['$justifyContent']
}>`
  display: flex;
  flex-direction: row;
  gap: ${(props) => getGapSize(props.$gap)}px;
  align-items: ${(props) => props.$alignItems || 'center'};
  justify-content: ${(props) => props.$justifyContent || 'start'};
  flex-wrap: wrap;
`

export const Column = styled.div<{
  $gap?: GridProps['$gap']
  $alignItems?: GridProps['$alignItems']
  $justifyContent?: GridProps['$justifyContent']
}>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => getGapSize(props.$gap)}px;
  align-items: ${(props) => props.$alignItems || 'stretch'};
  justify-content: ${(props) => props.$justifyContent || 'start'};
`

export const ResponsiveGrid = styled(Grid)<{
  $tabletColumns?: number | string
  $mobileColumns?: number | string
}>`
  @media (max-width: ${BREAKPOINTS.tablet}) {
    grid-template-columns: ${(props) => {
      if (props.$tabletColumns) {
        if (typeof props.$tabletColumns === 'number') {
          return `repeat(${props.$tabletColumns}, 1fr)`
        }
        return props.$tabletColumns
      }
      return 'repeat(2, 1fr)'
    }};
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    grid-template-columns: ${(props) => {
      if (props.$mobileColumns) {
        if (typeof props.$mobileColumns === 'number') {
          return `repeat(${props.$mobileColumns}, 1fr)`
        }
        return props.$mobileColumns
      }
      return '1fr'
    }};
  }
`

// Legacy compatibility - improved for better parts list layout
export const GridContainer = styled(Grid).attrs({ $gap: 'lg' })`
  /* Custom styling for parts list layout */
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  align-items: stretch;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    grid-template-columns: 1fr;
  }
`
