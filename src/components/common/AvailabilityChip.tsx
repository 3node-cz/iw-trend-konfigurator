import React from 'react'
import { Chip } from '@mui/material'
import { getAvailabilityColor, getAvailabilityText } from '../../utils/availability'

interface AvailabilityChipProps {
  availability: string
  size?: 'small' | 'medium'
  variant?: 'filled' | 'outlined'
  sx?: any
}

/**
 * Standardized availability status chip component
 * Shows localized Slovak text with appropriate color coding
 */
const AvailabilityChip: React.FC<AvailabilityChipProps> = ({
  availability,
  size = 'small',
  variant = 'outlined',
  sx
}) => {
  return (
    <Chip
      label={getAvailabilityText(availability)}
      size={size}
      color={getAvailabilityColor(availability)}
      variant={variant}
      sx={sx}
    />
  )
}

export default AvailabilityChip