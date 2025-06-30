import React from 'react'
import {
  Spinner,
  LoadingContainer,
  LoadingMessage,
  LoadingDotsContainer,
} from './LoadingIndicator.styles'

interface LoadingIndicatorProps {
  isLoading: boolean
  message?: string
  overlay?: boolean
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  isLoading,
  message = 'Calculating layout...',
  overlay = false,
}) => {
  if (!isLoading) return null

  return (
    <LoadingContainer $overlay={overlay}>
      <Spinner />
      <LoadingMessage>{message}</LoadingMessage>
    </LoadingContainer>
  )
}

// Lightweight loading dots for inline use
export const LoadingDots: React.FC<{ isLoading: boolean }> = ({
  isLoading,
}) => {
  if (!isLoading) return null

  return <LoadingDotsContainer />
}
