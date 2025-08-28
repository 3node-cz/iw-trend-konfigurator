import React from 'react'
import {
  LoadingIndicator as BaseLoadingIndicator,
  LoadingDots as BaseLoadingDots,
} from './common/ui/LoadingIndicator'

// Re-export with default message specific to this application
interface LoadingIndicatorProps {
  isLoading: boolean
  message?: string
  overlay?: boolean
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  isLoading,
  message = 'Calculating layout...', // Default message specific to this app
  overlay = false,
}) => {
  return (
    <BaseLoadingIndicator
      isLoading={isLoading}
      message={message}
      overlay={overlay}
    />
  )
}

// Re-export lightweight loading dots for inline use
export const LoadingDots: React.FC<{ isLoading: boolean }> = ({
  isLoading,
}) => {
  return <BaseLoadingDots isLoading={isLoading} />
}
