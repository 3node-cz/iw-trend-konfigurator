import React from 'react'
import { Container } from '@mui/material'
import { UI_CONSTANTS } from '../../constants'

interface PageContainerProps {
  children: React.ReactNode
  compact?: boolean
  sx?: object
  disableGutters?: boolean
}

/**
 * Consistent page container component used across the application
 */
const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  compact = false,
  sx,
  disableGutters,
  ...props 
}) => {
  return (
    <Container 
      maxWidth={false}
      disableGutters={disableGutters}
      sx={{ 
        maxWidth: UI_CONSTANTS.LAYOUT.MAX_CONTAINER_WIDTH, 
        mx: 'auto', 
        py: compact ? UI_CONSTANTS.LAYOUT.COMPACT_PADDING : UI_CONSTANTS.LAYOUT.DEFAULT_PADDING,
        ...sx 
      }}
    >
      {children}
    </Container>
  )
}

export default PageContainer