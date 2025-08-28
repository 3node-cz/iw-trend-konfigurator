import React from 'react'
import type { Part } from '../../../types/simple'
import { renderPartShape } from '../../../utils/svgRendering'
import {
  PartCanvas,
  PartSvg,
  DimensionLabel,
  PreviewLegend,
  HintText,
} from './PartVisualPreview.styles'

interface PartPreviewCanvasProps {
  part: Part
}

export const PartPreviewCanvas: React.FC<PartPreviewCanvasProps> = React.memo(
  ({ part }) => {
    // Use renderPartShape directly - React.memo will prevent unnecessary re-renders
    const {
      originalOutline,
      modifiedShape,
      cornerIndicators,
      previewWidth,
      previewHeight,
    } = renderPartShape(part)

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
    )

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

        <HintText>
          💡 Úpravy rohov a hrán neovplyvňujú rozloženie na doske - diely sa
          ukladajú ako obdĺžniky
        </HintText>
      </>
    )
  },
)
