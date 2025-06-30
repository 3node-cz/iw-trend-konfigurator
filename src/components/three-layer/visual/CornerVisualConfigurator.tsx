import React from 'react'
import type { Part, CornerModification } from '../../../types/simple'
import {
  CORNER_POSITIONS,
  CORNER_TYPE_OPTIONS,
} from '../../../utils/edgeConstants'
import {
  calculateMaxCornerRadius,
  calculateMaxCornerDimension,
} from '../../../utils/cornerCalculations'
import { getCornerTitle } from '../../../utils/partFormatting'
import { FORM_DEFAULTS } from '../../../utils/appConstants'
import {
  FormSection,
  CornersGrid,
  CornerSection,
  FormGroup,
} from './CornerVisualConfigurator.styles'

interface CornerConfiguratorProps {
  part: Part
  onCornerUpdate: (corner: string, updates: Partial<CornerModification>) => void
}

export const CornerConfigurator: React.FC<CornerConfiguratorProps> = ({
  part,
  onCornerUpdate,
}) => {
  const renderCornerControls = (corner: string) => {
    const corners = (part.corners as Record<string, CornerModification>) || {}
    const cornerData = corners[corner] || { type: 'none' }

    const maxRadius = calculateMaxCornerRadius(part, corner)
    const maxBevelX = calculateMaxCornerDimension(part, corner, 'x')
    const maxBevelY = calculateMaxCornerDimension(part, corner, 'y')

    return (
      <CornerSection key={corner}>
        <div className="corner-title">{getCornerTitle(corner)}</div>

        <FormGroup>
          <select
            value={cornerData.type}
            onChange={(e) =>
              onCornerUpdate(corner, {
                type: e.target.value as 'none' | 'bevel' | 'round',
                x:
                  e.target.value === 'none'
                    ? undefined
                    : cornerData.x || FORM_DEFAULTS.cornerValue,
                y:
                  e.target.value === 'bevel'
                    ? cornerData.y || FORM_DEFAULTS.cornerValue
                    : undefined,
              })
            }
          >
            {CORNER_TYPE_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
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
                className={(cornerData.x || 0) > maxBevelX ? 'invalid' : ''}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  const clampedValue = Math.min(Math.max(0, value), maxBevelX)
                  onCornerUpdate(corner, { x: clampedValue })
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
                className={(cornerData.y || 0) > maxBevelY ? 'invalid' : ''}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  const clampedValue = Math.min(Math.max(0, value), maxBevelY)
                  onCornerUpdate(corner, { y: clampedValue })
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
              className={(cornerData.x || 0) > maxRadius ? 'invalid' : ''}
              onChange={(e) => {
                const value = Number(e.target.value)
                const clampedValue = Math.min(Math.max(0, value), maxRadius)
                onCornerUpdate(corner, { x: clampedValue })
              }}
            />
          </FormGroup>
        )}
      </CornerSection>
    )
  }

  return (
    <FormSection>
      <h3>Rohy</h3>
      <CornersGrid>
        {CORNER_POSITIONS.map((corner) => renderCornerControls(corner))}
      </CornersGrid>
    </FormSection>
  )
}
