import React from 'react';
import styled from 'styled-components';
import type { Part } from '../types/simple';
import { renderPartShape } from '../utils/svgRendering';

const PartCanvas = styled.div<{ $aspectRatio: number }>`
  width: 100%;
  max-width: 500px;
  height: ${props => 500 / props.$aspectRatio}px;
  max-height: 400px;
  margin: 0 auto 20px;
  background: #f8f9fa;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const PartSvg = styled.svg`
  max-width: 100%;
  max-height: 100%;
  overflow: visible;
`;

const DimensionLabel = styled.div<{ $position: 'width' | 'height' }>`
  position: absolute;
  font-size: 0.8rem;
  font-weight: 600;
  color: #2c3e50;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid #e1e8ed;
  
  ${props => props.$position === 'width' ? `
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
  ` : `
    right: -15px;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
    transform-origin: center;
  `}
`;

const PreviewLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: #7f8c8d;
  }
  
  .legend-box {
    width: 16px;
    height: 3px;
    border-radius: 1px;
    
    &.dashed {
      border: 1px dashed #bdc3c7;
      background: transparent;
    }
    
    &.solid {
      background: #3498db;
    }
  }
  
  .legend-circle {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    
    &.corner {
      background: #e74c3c;
    }
  }
`;

interface PartPreviewCanvasProps {
  part: Part;
}

export const PartPreviewCanvas: React.FC<PartPreviewCanvasProps> = React.memo(({ part }) => {
  // Use renderPartShape directly - React.memo will prevent unnecessary re-renders
  const { originalOutline, modifiedShape, cornerIndicators, previewWidth, previewHeight } = renderPartShape(part);

  // Convert the data to JSX elements
  const svgContent = (
    <>
      {/* Original dimensions (dashed outline) */}
      <path
        d={originalOutline.d}
        fill={originalOutline.fill}
        stroke={originalOutline.stroke}
        strokeWidth={originalOutline.strokeWidth}
        strokeDasharray={originalOutline.strokeDasharray}
      />
      
      {/* Modified shape (solid) */}
      <path
        d={modifiedShape.d}
        fill={modifiedShape.fill}
        stroke={modifiedShape.stroke}
        strokeWidth={modifiedShape.strokeWidth}
        strokeDasharray={modifiedShape.strokeDasharray}
      />
      
      {/* Corner modification indicators */}
      {cornerIndicators.map((indicator) => (
        <circle
          key={indicator.key}
          cx={indicator.cx}
          cy={indicator.cy}
          r={indicator.r}
          fill={indicator.fill}
        />
      ))}
    </>
  );

  return (
    <>
      <PartCanvas $aspectRatio={part.width / part.height}>
        <PartSvg viewBox={`0 0 ${previewWidth} ${previewHeight}`}>
          {svgContent}
        </PartSvg>
        
        <DimensionLabel $position="width">{part.width} mm</DimensionLabel>
        <DimensionLabel $position="height">{part.height} mm</DimensionLabel>
      </PartCanvas>
      
      <PreviewLegend>
        <div className="legend-item">
          <div className="legend-box dashed"></div>
          <span>Originál rozmer</span>
        </div>
        <div className="legend-item">
          <div className="legend-box solid"></div>
          <span>S úpravami</span>
        </div>
        <div className="legend-item">
          <div className="legend-circle corner"></div>
          <span>Upravený roh</span>
        </div>
      </PreviewLegend>
      
      <div style={{ fontSize: '0.75rem', color: '#7f8c8d', textAlign: 'center', marginBottom: '16px' }}>
        💡 Úpravy rohov a hrán neovplyvňujú rozloženie na doske - diely sa ukladajú ako obdĺžniky
      </div>
    </>
  );
});
