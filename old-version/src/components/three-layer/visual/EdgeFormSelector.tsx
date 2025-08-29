/**
 * EdgeFormSelector Component
 *
 * A compact edge selector component for use in forms and part rows.
 * Displays edge options in a horizontal grid layout.
 */

import React from 'react'
import type { EdgeValue } from '../../../utils/edgeConstants'
import { EDGE_OPTIONS, EDGE_LABELS } from '../../../utils/edgeConstants'
import { Select } from '../../common/ui'
import {
  EdgeFormContainer,
  EdgeGrid,
  EdgeField,
  EdgeLabel,
} from './EdgeFormSelector.styles.ts'

interface EdgeFormSelectorProps {
  edges?: {
    top?: EdgeValue
    right?: EdgeValue
    bottom?: EdgeValue
    left?: EdgeValue
  }
  onEdgeUpdate: (edge: string, value: EdgeValue) => void
  size?: 'small' | 'medium'
  orientation?: 'horizontal' | 'vertical'
}

export const EdgeFormSelector: React.FC<EdgeFormSelectorProps> = ({
  edges = {},
  onEdgeUpdate,
  size = 'small',
  orientation = 'horizontal',
}) => {
  const renderEdgeSelect = (edgeKey: keyof typeof EDGE_LABELS) => (
    <EdgeField key={edgeKey}>
      <EdgeLabel $size={size}>{EDGE_LABELS[edgeKey]}</EdgeLabel>
      <Select
        value={edges[edgeKey] || 'none'}
        onChange={(e) => onEdgeUpdate(edgeKey, e.target.value as EdgeValue)}
        $size={size}
        $fullWidth
      >
        {EDGE_OPTIONS.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </Select>
    </EdgeField>
  )

  return (
    <EdgeFormContainer $orientation={orientation}>
      <EdgeGrid $orientation={orientation}>
        {renderEdgeSelect('top')}
        {renderEdgeSelect('right')}
        {renderEdgeSelect('bottom')}
        {renderEdgeSelect('left')}
      </EdgeGrid>
    </EdgeFormContainer>
  )
}
