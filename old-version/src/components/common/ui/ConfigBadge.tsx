/**
 * ConfigBadge Component
 *
 * A specialized badge component for displaying configuration status indicators.
 */

import React, { useState } from 'react'
import styled from 'styled-components'
import { Badge } from './Badge'
import { RelativeContainer, Tooltip } from './Tooltip'

// Configuration badge type variants
export type ConfigBadgeType = 'corners' | 'edges' | 'lshape' | 'frame'

// Maps config types to their visual presentation
const CONFIG_TYPE_COLORS: Record<ConfigBadgeType, string> = {
  corners: '#27ae60', // success color
  edges: '#3498db', // primary/info color
  lshape: '#f39c12', // warning color
  frame: '#9b59b6', // purple
}

interface ConfigBadgeProps {
  type: ConfigBadgeType
  tooltipText: string
  children: React.ReactNode
}

// Styled badge with configuration-specific styling
const StyledConfigBadge = styled(Badge)<{ $type: ConfigBadgeType }>`
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  font-weight: bold;
  cursor: help;
  color: ${(props) => (props.$type === 'lshape' ? '#000' : '#fff')};
  background-color: ${(props) => CONFIG_TYPE_COLORS[props.$type]};
  border-radius: 50%;
`

export const ConfigBadge: React.FC<ConfigBadgeProps> = ({
  type,
  tooltipText,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <RelativeContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <StyledConfigBadge
        $type={type}
        $shape="circle"
        $size="small"
      >
        {children}
      </StyledConfigBadge>
      <Tooltip $visible={isHovered}>{tooltipText}</Tooltip>
    </RelativeContainer>
  )
}
