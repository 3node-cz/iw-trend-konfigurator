import React from 'react'
import type { Part } from '../../../types/simple'
import type { EdgeValue } from '../../../utils/edgeConstants'
import { EDGE_OPTIONS, EDGE_LABELS } from '../../../utils/edgeConstants'
import { FormSection, EdgesGrid, FormGroup } from './EdgeVisualSelector.styles'

interface EdgeSelectorProps {
  part: Part
  onEdgeUpdate: (edge: string, value: EdgeValue) => void
}

export const EdgeSelector: React.FC<EdgeSelectorProps> = ({
  part,
  onEdgeUpdate,
}) => {
  const renderEdgeSelect = (edgeKey: keyof typeof EDGE_LABELS) => (
    <FormGroup key={edgeKey}>
      <label>{EDGE_LABELS[edgeKey]}</label>
      <select
        value={part.edges?.[edgeKey] || 'none'}
        onChange={(e) => onEdgeUpdate(edgeKey, e.target.value as EdgeValue)}
      >
        {EDGE_OPTIONS.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </FormGroup>
  )

  return (
    <FormSection>
      <h3>Hrany</h3>
      <EdgesGrid>
        {renderEdgeSelect('top')}
        {renderEdgeSelect('right')}
        {renderEdgeSelect('bottom')}
        {renderEdgeSelect('left')}
      </EdgesGrid>
    </FormSection>
  )
}
