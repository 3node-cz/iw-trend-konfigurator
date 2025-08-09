/**
 * Styled components for EdgeFormSelector
 */
import styled from 'styled-components'
import { SPACING, TYPOGRAPHY, COLORS } from '../../../utils/uiConstants'

export const EdgeFormContainer = styled.div<{
  $orientation: 'horizontal' | 'vertical'
}>`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.sm}px;
  width: 100%;
`

export const EdgeGrid = styled.div<{ $orientation: 'horizontal' | 'vertical' }>`
  display: grid;
  gap: ${SPACING.sm}px;
  width: 100%;

  ${(props) =>
    props.$orientation === 'horizontal'
      ? `
      grid-template-columns: repeat(4, 1fr);

      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
    `
      : `
      grid-template-columns: 1fr;
    `}
`

export const EdgeField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`

export const EdgeLabel = styled.label<{ $size?: 'small' | 'medium' }>`
  font-size: ${(props) =>
    props.$size === 'small' ? TYPOGRAPHY.fontSize.xs : TYPOGRAPHY.fontSize.sm};
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
  color: ${COLORS.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
