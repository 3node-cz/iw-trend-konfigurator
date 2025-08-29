import React from 'react'
import styled from 'styled-components'
import type { Part } from '../types/simple'
import type { LShapePreviewData } from './lShapePreview'

const LShapeSvg = styled.svg`
  width: 100%;
  height: 100%;
  max-width: 600px;
  max-height: 450px;
`

interface LShapeSvgProps {
  part: Part
  previewData: LShapePreviewData
  leftWidth: number
  rightHeight: number
}

export const renderLShapeSvg = ({
  part,
  previewData,
  leftWidth,
  rightHeight,
}: LShapeSvgProps): React.ReactElement => {
  const {
    previewWidth,
    previewHeight,
    path,
    viewBoxWidth,
    viewBoxHeight,
    shapeOffsetX,
    shapeOffsetY,
  } = previewData

  return (
    <LShapeSvg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
      {/* L-shape outline */}
      <path
        d={path}
        fill="rgba(52, 152, 219, 0.1)"
        stroke="#3498db"
        strokeWidth="2"
        transform={`translate(${shapeOffsetX}, ${shapeOffsetY})`}
      />

      {/* Main dimension labels */}
      {/* Width label below the shape */}
      <text
        x={shapeOffsetX + previewWidth / 2}
        y={shapeOffsetY + previewHeight + 20}
        textAnchor="middle"
        fontSize="16"
        fill="#666"
        fontWeight="bold"
      >
        {part.width} mm
      </text>
      <text
        x={shapeOffsetX - 8}
        y={shapeOffsetY + previewHeight / 2}
        textAnchor="middle"
        fontSize="16"
        fill="#2c3e50"
        fontWeight="bold"
        transform={`rotate(-90, ${shapeOffsetX - 8}, ${
          shapeOffsetY + previewHeight / 2
        })`}
      >
        {part.height} mm
      </text>

      {/* Cut dimension markers - positioned outside the shape */}
      {/* Left width label - positioned above the shape */}
      <text
        x={shapeOffsetX + 20}
        y={shapeOffsetY - 10}
        textAnchor="start"
        fontSize="16"
        fill="#e74c3c"
        fontWeight="bold"
      >
        {leftWidth} mm
      </text>
      {/* Right height label - vertical, positioned to the right of the shape, rotated 180 degrees */}
      <text
        x={shapeOffsetX + previewWidth + 20}
        y={shapeOffsetY + previewHeight - 30}
        textAnchor="middle"
        fontSize="16"
        fill="#e74c3c"
        fontWeight="bold"
        transform={`rotate(90, ${shapeOffsetX + previewWidth + 20}, ${
          shapeOffsetY + previewHeight - 30
        })`}
      >
        {rightHeight} mm
      </text>
    </LShapeSvg>
  )
}
