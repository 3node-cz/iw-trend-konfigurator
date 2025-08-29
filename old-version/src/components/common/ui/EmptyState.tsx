/**
 * EmptyState Component
 *
 * A component to display when there is no content to show.
 */

import React from 'react'
import styled from 'styled-components'
import { COLORS, SPACING } from '../../../utils/uiConstants'
import { Text } from './Text'

interface EmptyStateProps {
  title?: string
  message: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${SPACING.xxxl}px;
  text-align: center;
  background-color: ${COLORS.hoverLight};
  border-radius: 8px;
  border: 1px dashed ${COLORS.border};
  margin: ${SPACING.xl}px 0;
`

const IconContainer = styled.div`
  font-size: 2.5rem;
  color: ${COLORS.textMuted};
  margin-bottom: ${SPACING.lg}px;
`

const Title = styled(Text).attrs({
  $variant: 'subtitle',
  $weight: 'semibold',
})`
  margin-bottom: ${SPACING.md}px;
`

const Message = styled(Text).attrs({
  $variant: 'caption',
})`
  max-width: 400px;
  margin-bottom: ${SPACING.xl}px;
`

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  action,
}) => {
  return (
    <EmptyStateContainer>
      {icon && <IconContainer>{icon}</IconContainer>}
      {title && <Title>{title}</Title>}
      <Message>{message}</Message>
      {action && action}
    </EmptyStateContainer>
  )
}

// Legacy compatibility
export { EmptyStateContainer }
