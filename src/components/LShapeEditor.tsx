import React from 'react';
import styled from 'styled-components';
import type { Part, LShapeConfig } from '../types/simple';
import { 
  calculateLShapePreviewDimensions, 
  generateLShapePath
} from '../utils/lShapeHelpers';

const LShapeContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
  margin-bottom: 20px;
`;

const LShapeTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.3rem;
`;

const LShapeToggle = styled.div`
  margin-bottom: 20px;
  
  label {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
    cursor: pointer;
    
    input {
      margin-right: 8px;
    }
  }
`;

const DimensionsHeader = styled.div`
  background: #e8f4fd;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;
  
  .total-dimensions {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1rem;
  }
  
  .dimensions-label {
    font-size: 0.8rem;
    color: #7f8c8d;
    margin-top: 2px;
  }
`;

const VisualConfigurator = styled.div`
  position: relative;
  background: #f8f9fa;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  min-height: 300px;
`;

const LShapeSvg = styled.svg`
  width: 100%;
  height: 100%;
  max-width: 400px;
  max-height: 300px;
`;

const InputField = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: white;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid #e1e8ed;
  
  label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #2c3e50;
    white-space: nowrap;
  }
  
  input {
    width: 60px;
    padding: 4px 6px;
    border: 1px solid #ddd;
    border-radius: 3px;
    font-size: 0.8rem;
    text-align: center;
    
    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
  }
`;

interface LShapeEditorProps {
  selectedPart: Part | null;
  onPartUpdate: (id: string, updates: Partial<Part>) => void;
}

export const LShapeEditor: React.FC<LShapeEditorProps> = React.memo(({ selectedPart, onPartUpdate }) => {
  if (!selectedPart) {
    return (
      <LShapeContainer>
        <LShapeTitle>L-tvar konfigurátor</LShapeTitle>
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7f8c8d' }}>
          <p>Vyberte diel pre úpravu L-tvaru</p>
        </div>
      </LShapeContainer>
    );
  }

  const lShape = selectedPart.lShape;

  const handleLShapeToggle = (enabled: boolean) => {
    if (enabled) {
      const defaultLShape: LShapeConfig = {
        enabled: true,
        topLeftWidth: Math.min(200, Math.floor(selectedPart.width * 0.6)),
        topLeftHeight: Math.min(200, Math.floor(selectedPart.height * 0.6)),
        topInnerCornerRadius: 0,
        bottomInnerCornerRadius: 0
      };
      onPartUpdate(selectedPart.id, { lShape: defaultLShape });
    } else {
      onPartUpdate(selectedPart.id, { lShape: { enabled: false } });
    }
  };

  const handleLShapeUpdate = (updates: Partial<LShapeConfig>) => {
    const currentLShape = selectedPart.lShape || { enabled: false };
    onPartUpdate(selectedPart.id, {
      lShape: { ...currentLShape, ...updates }
    });
  };

  const renderLShapeVisualization = () => {
    if (!lShape?.enabled) return null;

    const dimensions = calculateLShapePreviewDimensions(selectedPart, 300, 20);
    const path = generateLShapePath(dimensions);
    const { viewBoxWidth, viewBoxHeight, padding, width, height } = dimensions;

    // Calculate input field positions
    const topLeftW = lShape.topLeftWidth || 0;
    const topLeftH = lShape.topLeftHeight || 0;
    const topRadius = lShape.topInnerCornerRadius || 0;
    const bottomRadius = lShape.bottomInnerCornerRadius || 0;

    const scale = dimensions.scale;
    const scaledTopLeftW = topLeftW * scale;
    const scaledTopLeftH = topLeftH * scale;

    return (
      <div style={{ position: 'relative', width: '100%', height: '300px' }}>
        <LShapeSvg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
          {/* L-shape outline */}
          <path
            d={path}
            fill="rgba(52, 152, 219, 0.1)"
            stroke="#3498db"
            strokeWidth="2"
          />
          
          {/* Corner radii visualization */}
          {topRadius > 0 && (
            <circle
              cx={padding + scaledTopLeftW}
              cy={padding + scaledTopLeftH}
              r={topRadius * scale}
              fill="none"
              stroke="#e74c3c"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
          )}
          
          {bottomRadius > 0 && (
            <circle
              cx={padding + scaledTopLeftW}
              cy={padding + scaledTopLeftH}
              r={bottomRadius * scale}
              fill="none"
              stroke="#e74c3c"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
          )}
          
          {/* Dimension labels */}
          <text x={padding + width / 2} y={padding - 5} textAnchor="middle" fontSize="12" fill="#2c3e50" fontWeight="bold">
            {selectedPart.width} mm
          </text>
          <text 
            x={padding - 5} 
            y={padding + height / 2} 
            textAnchor="middle" 
            fontSize="12" 
            fill="#2c3e50" 
            fontWeight="bold"
            transform={`rotate(-90, ${padding - 5}, ${padding + height / 2})`}
          >
            {selectedPart.height} mm
          </text>
        </LShapeSvg>

        {/* Positioned input fields around the shape */}
        <InputField style={{ 
          top: '20px', 
          left: `${50 + (scaledTopLeftW / width) * 50}%`,
          transform: 'translateX(-50%)'
        }}>
          <label>Šírka zľava</label>
          <input
            type="number"
            min="50"
            max={Math.floor(selectedPart.width * 0.8)}
            value={topLeftW}
            onChange={(e) => {
              const value = Math.min(Math.max(50, Number(e.target.value)), Math.floor(selectedPart.width * 0.8));
              handleLShapeUpdate({ topLeftWidth: value });
            }}
          />
        </InputField>

        <InputField style={{ 
          left: '20px', 
          top: `${50 + (scaledTopLeftH / height) * 40}%`,
          transform: 'translateY(-50%)'
        }}>
          <label>Výška zdola</label>
          <input
            type="number"
            min="50"
            max={Math.floor(selectedPart.height * 0.8)}
            value={topLeftH}
            onChange={(e) => {
              const value = Math.min(Math.max(50, Number(e.target.value)), Math.floor(selectedPart.height * 0.8));
              handleLShapeUpdate({ topLeftHeight: value });
            }}
          />
        </InputField>

        <InputField style={{ 
          top: `${30 + (scaledTopLeftH / height) * 40}%`, 
          left: `${45 + (scaledTopLeftW / width) * 50}%`,
          transform: 'translate(-50%, -50%)'
        }}>
          <label>Horný rádius</label>
          <input
            type="number"
            min="0"
            max="50"
            value={topRadius}
            onChange={(e) => {
              const value = Math.min(Math.max(0, Number(e.target.value)), 50);
              handleLShapeUpdate({ topInnerCornerRadius: value });
            }}
          />
        </InputField>

        <InputField style={{ 
          bottom: '20px', 
          left: `${45 + (scaledTopLeftW / width) * 50}%`,
          transform: 'translateX(-50%)'
        }}>
          <label>Spodný rádius</label>
          <input
            type="number"
            min="0"
            max="50"
            value={bottomRadius}
            onChange={(e) => {
              const value = Math.min(Math.max(0, Number(e.target.value)), 50);
              handleLShapeUpdate({ bottomInnerCornerRadius: value });
            }}
          />
        </InputField>
      </div>
    );
  };

  return (
    <LShapeContainer>
      <LShapeTitle>L-tvar konfigurátor</LShapeTitle>
      
      <LShapeToggle>
        <label>
          <input
            type="checkbox"
            checked={lShape?.enabled || false}
            onChange={(e) => handleLShapeToggle(e.target.checked)}
          />
          Povoliť L-tvar
        </label>
      </LShapeToggle>

      {lShape?.enabled && (
        <>
          <DimensionsHeader>
            <div className="total-dimensions">
              {selectedPart.width} × {selectedPart.height} mm
            </div>
            <div className="dimensions-label">Celkové rozmery dielu</div>
          </DimensionsHeader>
          
          <VisualConfigurator>
            {renderLShapeVisualization()}
          </VisualConfigurator>
        </>
      )}
    </LShapeContainer>
  );
});

LShapeEditor.displayName = 'LShapeEditor';
