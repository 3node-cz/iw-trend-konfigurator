import styled from 'styled-components'
import {
  COLORS,
  TYPOGRAPHY,
  LAYOUT,
  SPACING,
  BREAKPOINTS,
} from '../utils/uiConstants'

export const AppContainer = styled.div`
  max-width: ${LAYOUT.maxWidth};
  margin: 0 auto;
  padding: ${SPACING.xxl}px;
  font-family: ${TYPOGRAPHY.fontFamily.system};
  background: ${COLORS.background};
  min-height: 100vh;
`

export const Header = styled.header`
  text-align: center;
  margin-bottom: ${SPACING.xxxl * 1.5}px;

  h1 {
    color: ${COLORS.textPrimary};
    font-size: ${TYPOGRAPHY.fontSize['3xl']};
    margin-bottom: ${SPACING.md}px;
  }

  p {
    color: ${COLORS.textSecondary};
    font-size: ${TYPOGRAPHY.fontSize.base};
    margin: 0;
  }
`

export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${SPACING.xxl}px;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    grid-template-columns: 1fr;
  }
`

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.xxl}px;
`

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const LayoutContainer = styled.div`
  position: relative;
`
