import React from 'react'
import styled from 'styled-components'
import type { FrameConfig } from '../../../types/simple'
import { COLORS, SPACING, TYPOGRAPHY } from '../../../utils/uiConstants'
import { getFramePieceDimensions } from '../../../utils/frameCalculations'
import {
  FRAME_TYPE_COMPONENTS,
  getFrameWidth,
  calculateInnerDimensions,
} from '../../../utils/frameHelpers'

const FrameContainer = styled.div`
  padding: ${SPACING.lg}px;
  border: 1px solid ${COLORS.border};
  border-radius: 8px;
`

const FrameTitle = styled.h3`
  margin: 0 0 ${SPACING.md}px 0;
  font-size: ${TYPOGRAPHY.fontSize.lg};
  color: ${COLORS.textPrimary};
`

const FrameTypeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${SPACING.md}px;
  margin-bottom: ${SPACING.md}px;
`

const FrameTypeTile = styled.div<{ $selected: boolean }>`
  padding: ${SPACING.sm}px;
  border: 2px solid
    ${(props) => (props.$selected ? COLORS.primary : COLORS.border)};
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;

  &:hover {
    border-color: ${COLORS.primary};
  }
`

const FramePreview = styled.div`
  background-color: ${COLORS.background};
  border: 1px solid ${COLORS.border};
  border-radius: 4px;
  padding: ${SPACING.sm}px ${SPACING.md}px;
  margin-top: ${SPACING.md}px;

  > div {
    margin-bottom: ${SPACING.xs}px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  font-size: ${TYPOGRAPHY.fontSize.sm};
  margin-top: ${SPACING.md}px;
`

interface FrameVisualEditorProps {
  frameConfig: FrameConfig
  partWidth: number
  partHeight: number
  onFrameConfigChange: (config: FrameConfig) => void
}

const frameTypeComponents = FRAME_TYPE_COMPONENTS

export const FrameVisualEditor: React.FC<FrameVisualEditorProps> = ({
  frameConfig,
  partWidth,
  partHeight,
  onFrameConfigChange,
}) => {
  const frameWidth = getFrameWidth(frameConfig)
  const { isValid: isValidFrame } = calculateInnerDimensions(
    partWidth,
    partHeight,
    frameConfig,
  )

  // Get correct piece dimensions based on frame type
  const pieceDimensions = isValidFrame
    ? getFramePieceDimensions(partWidth, partHeight, frameConfig)
    : null

  const handleFrameTypeChange = (type: FrameConfig['type']) => {
    onFrameConfigChange({
      ...frameConfig,
      type,
    })
  }

  return (
    <FrameContainer>
      <FrameTitle>Frame Configuration (Rámček)</FrameTitle>

      <FrameTypeGrid>
        {Object.entries(frameTypeComponents).map(([type, IconComponent]) => (
          <FrameTypeTile
            key={type}
            $selected={frameConfig.type === type}
            onClick={() => handleFrameTypeChange(type as FrameConfig['type'])}
          >
            <IconComponent
              width={120}
              height={90}
            />
          </FrameTypeTile>
        ))}
      </FrameTypeGrid>

      {frameConfig.enabled && (
        <FramePreview>
          {isValidFrame && pieceDimensions ? (
            <>
              <div>Frame will be divided into 4 pieces:</div>
              <div>
                2× {pieceDimensions.top.width}×{pieceDimensions.top.height} mm,
                2× {pieceDimensions.left.width}×{pieceDimensions.left.height} mm
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: COLORS.textSecondary,
                  marginTop: '8px',
                }}
              >
                * Frame width: {frameWidth}mm
              </div>
            </>
          ) : (
            <div style={{ color: COLORS.danger }}>
              Frame width ({frameWidth}mm) is too large for part dimensions (
              {partWidth} × {partHeight} mm)
            </div>
          )}
        </FramePreview>
      )}
    </FrameContainer>
  )
}
