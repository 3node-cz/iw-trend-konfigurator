import React from 'react'
import { Container, ContainerProps } from '@mui/material'
import { UI_CONSTANTS } from '../../constants'

interface PageContainerProps extends Omit<ContainerProps, 'maxWidth'> {
  children: React.ReactNode
  compact?: boolean
}

/**
 * Consistent page container component used across the application
 */
const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  compact = false,
  sx,
  ...props 
}) => {
  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        maxWidth: UI_CONSTANTS.LAYOUT.MAX_CONTAINER_WIDTH, 
        mx: 'auto', 
        py: compact ? UI_CONSTANTS.LAYOUT.COMPACT_PADDING : UI_CONSTANTS.LAYOUT.DEFAULT_PADDING,
        ...sx 
      }}
      {...props}
    >
      {children}
    </Container>
  )
}

export default PageContainer