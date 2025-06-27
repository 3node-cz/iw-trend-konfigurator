import React from 'react';
import styled from 'styled-components';
import type { Part } from '../types/simple';
import type { EdgeValue } from '../utils/edgeConstants';
import { EDGE_OPTIONS, EDGE_LABELS } from '../utils/edgeConstants';

const FormSection = styled.div`
  margin-bottom: 20px;
  
  h3 {
    color: #2c3e50;
    margin-bottom: 12px;
    font-size: 1.1rem;
  }
`;

const EdgesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
  }
  
  select {
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
  }
`;

interface EdgeSelectorProps {
  part: Part;
  onEdgeUpdate: (edge: string, value: EdgeValue) => void;
}

export const EdgeSelector: React.FC<EdgeSelectorProps> = ({ part, onEdgeUpdate }) => {
  const renderEdgeSelect = (edgeKey: keyof typeof EDGE_LABELS) => (
    <FormGroup key={edgeKey}>
      <label>{EDGE_LABELS[edgeKey]}</label>
      <select
        value={part.edges?.[edgeKey] || 'none'}
        onChange={(e) => onEdgeUpdate(edgeKey, e.target.value as EdgeValue)}
      >
        {EDGE_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormGroup>
  );

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
  );
};
