import React from 'react';
import styled from 'styled-components';
import type { Part, CornerModification } from '../types/simple';
import { 
  CORNER_POSITIONS, 
  CORNER_TYPE_OPTIONS 
} from '../utils/edgeConstants';
import { 
  calculateMaxCornerRadius, 
  calculateMaxCornerDimension 
} from '../utils/cornerCalculations';
import { getCornerTitle } from '../utils/partFormatting';
import { FORM_DEFAULTS } from '../utils/appConstants';

const FormSection = styled.div`
  margin-bottom: 20px;
  
  h3 {
    color: #2c3e50;
    margin-bottom: 12px;
    font-size: 1.1rem;
  }
`;

const CornersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CornerSection = styled.div`
  padding: 16px;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  background: #f8f9fa;
  
  .corner-title {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 12px;
    font-size: 0.9rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  
  label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.85rem;
    
    &.max-info {
      font-weight: 400;
      color: #7f8c8d;
      font-size: 0.75rem;
    }
  }
  
  input, select {
    padding: 6px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.85rem;
    
    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
    
    &.invalid {
      border-color: #e74c3c;
      background-color: #fdf2f2;
    }
  }
`;

interface CornerConfiguratorProps {
  part: Part;
  onCornerUpdate: (corner: string, updates: Partial<CornerModification>) => void;
}

export const CornerConfigurator: React.FC<CornerConfiguratorProps> = ({ 
  part, 
  onCornerUpdate 
}) => {
  const renderCornerControls = (corner: string) => {
    const corners = part.corners as Record<string, CornerModification> || {};
    const cornerData = corners[corner] || { type: 'none' };

    const maxRadius = calculateMaxCornerRadius(part, corner);
    const maxBevelX = calculateMaxCornerDimension(part, corner, 'x');
    const maxBevelY = calculateMaxCornerDimension(part, corner, 'y');
    
    return (
      <CornerSection key={corner}>
        <div className="corner-title">{getCornerTitle(corner)}</div>
        
        <FormGroup>
          <select
            value={cornerData.type}
            onChange={(e) => onCornerUpdate(corner, { 
              type: e.target.value as 'none' | 'bevel' | 'round',
              x: e.target.value === 'none' ? undefined : (cornerData.x || FORM_DEFAULTS.cornerValue),
              y: e.target.value === 'bevel' ? (cornerData.y || FORM_DEFAULTS.cornerValue) : undefined
            })}
          >
            {CORNER_TYPE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormGroup>
        
        {cornerData.type === 'bevel' && (
          <>
            <FormGroup>
              <label>X (mm)</label>
              <label className="max-info">max {Math.floor(maxBevelX)} mm</label>
              <input
                type="number"
                min="0"
                max={Math.floor(maxBevelX)}
                value={cornerData.x || 0}
                className={((cornerData.x || 0) > maxBevelX) ? 'invalid' : ''}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  const clampedValue = Math.min(Math.max(0, value), maxBevelX);
                  onCornerUpdate(corner, { x: clampedValue });
                }}
              />
            </FormGroup>
            <FormGroup>
              <label>Y (mm)</label>
              <label className="max-info">max {Math.floor(maxBevelY)} mm</label>
              <input
                type="number"
                min="0"
                max={Math.floor(maxBevelY)}
                value={cornerData.y || 0}
                className={((cornerData.y || 0) > maxBevelY) ? 'invalid' : ''}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  const clampedValue = Math.min(Math.max(0, value), maxBevelY);
                  onCornerUpdate(corner, { y: clampedValue });
                }}
              />
            </FormGroup>
          </>
        )}
        
        {cornerData.type === 'round' && (
          <FormGroup>
            <label>Polomer (mm)</label>
            <label className="max-info">max {Math.floor(maxRadius)} mm</label>
            <input
              type="number"
              min="0"
              max={Math.floor(maxRadius)}
              value={cornerData.x || 0}
              className={((cornerData.x || 0) > maxRadius) ? 'invalid' : ''}
              onChange={(e) => {
                const value = Number(e.target.value);
                const clampedValue = Math.min(Math.max(0, value), maxRadius);
                onCornerUpdate(corner, { x: clampedValue });
              }}
            />
          </FormGroup>
        )}
      </CornerSection>
    );
  };

  return (
    <FormSection>
      <h3>Rohy</h3>
      <CornersGrid>
        {CORNER_POSITIONS.map(corner => 
          renderCornerControls(corner)
        )}
      </CornersGrid>
    </FormSection>
  );
};
