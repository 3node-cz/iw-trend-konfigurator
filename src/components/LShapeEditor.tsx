import React from 'react'
import type { Part, LShapeConfig } from '../types/simple'
import { SPACING } from '../utils/uiConstants'
import {
  calculateLShapePreview,
  createLShapeDefault,
} from '../utils/lShapePreview'
import { renderLShapeSvg } from '../utils/lShapeSvgRenderer'
import {
  getLShapeConstraints,
  createLShapeUpdateHandlers,
} from '../utils/lShapeValidation'
import { getLShapeRadiusConstraints } from '../utils/lShapeRadiusCalculations'
import {
  LShapeContainer,
  LShapeTitle,
  LShapeToggle,
  DimensionsHeader,
  PreviewContainer,
  InputsContainer,
  InputGroup,
  SectionHeader,
} from './LShapeEditor.styles'

interface LShapeEditorProps {
  selectedPart: Part | null
  onPartUpdate: (id: string, updates: Partial<Part>) => void
}

export const LShapeEditor: React.FC<LShapeEditorProps> = React.memo(
  ({ selectedPart, onPartUpdate }) => {
    if (!selectedPart) {
      return (
        <LShapeContainer>
          <LShapeTitle>L-tvar konfigurátor</LShapeTitle>
          <div
            style={{
              textAlign: 'center',
              padding: `${SPACING.xxxl}px ${SPACING.xxl}px`,
              color: '#7f8c8d',
            }}
          >
            <p>Vyberte diel pre úpravu L-tvaru</p>
          </div>
        </LShapeContainer>
      )
    }

    const lShape = selectedPart.lShape
    const constraints = getLShapeConstraints(
      selectedPart.width,
      selectedPart,
      lShape || { enabled: false },
    )

    // Calculate radius constraints based on current L-shape configuration
    const radiusConstraints = lShape?.enabled
      ? getLShapeRadiusConstraints(selectedPart, lShape)
      : {
          bottomLeft: 0,
          topLeftCutout: 0,
          innerCutout: 0,
          rightBottomCutout: 0,
        }

    const handleLShapeUpdate = (updates: Partial<LShapeConfig>) => {
      const currentLShape = selectedPart.lShape || { enabled: false }
      onPartUpdate(selectedPart.id, {
        lShape: { ...currentLShape, ...updates },
      })
    }

    const handlers = createLShapeUpdateHandlers(
      selectedPart,
      lShape,
      handleLShapeUpdate,
      constraints,
      () => createLShapeDefault(selectedPart),
    )

    const renderLShapePreview = () => {
      if (!lShape?.enabled) return null

      const leftWidth = lShape.leftWidth || 0
      const rightHeight = lShape.rightWidth || 0

      const previewData = calculateLShapePreview(selectedPart, lShape)

      return renderLShapeSvg({
        part: selectedPart,
        previewData,
        leftWidth,
        rightHeight,
      })
    }

    return (
      <LShapeContainer>
        <LShapeTitle>L-tvar konfigurátor</LShapeTitle>

        <LShapeToggle>
          <label>
            <input
              type="checkbox"
              checked={lShape?.enabled || false}
              onChange={(e) => handlers.handleToggle(e.target.checked)}
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

            <PreviewContainer>{renderLShapePreview()}</PreviewContainer>

            <SectionHeader>Šírky výrezu</SectionHeader>
            <InputsContainer>
              <InputGroup>
                <label>Šířka levé horní části (mm)</label>
                <input
                  type="number"
                  min="0"
                  max={constraints.maxWidth}
                  value={lShape.leftWidth || 0}
                  onChange={(e) =>
                    handlers.handleLeftWidthChange(e.target.value)
                  }
                />
              </InputGroup>

              <InputGroup>
                <label>Šířka pravé dolní části (mm)</label>
                <input
                  type="number"
                  min="0"
                  max={constraints.maxWidth}
                  value={lShape.rightWidth || 0}
                  onChange={(e) =>
                    handlers.handleRightWidthChange(e.target.value)
                  }
                />
              </InputGroup>
            </InputsContainer>

            <SectionHeader>Zaoblenie rohov</SectionHeader>
            <InputsContainer>
              <InputGroup>
                <label>Ľavý dolný roh (mm)</label>
                <input
                  type="number"
                  min="0"
                  max={radiusConstraints.bottomLeft}
                  value={lShape.bottomLeftRadius || 0}
                  onChange={(e) =>
                    handlers.handleBottomLeftRadiusChange(e.target.value)
                  }
                />
              </InputGroup>

              <InputGroup>
                <label>Ľavý horný roh (mm)</label>
                <input
                  type="number"
                  min="0"
                  max={radiusConstraints.topLeftCutout}
                  value={lShape.topLeftCutoutRadius || 0}
                  onChange={(e) =>
                    handlers.handleTopLeftCutoutRadiusChange(e.target.value)
                  }
                />
              </InputGroup>

              <InputGroup>
                <label>Vnútorný roh (mm)</label>
                <input
                  type="number"
                  min="0"
                  max={radiusConstraints.innerCutout}
                  value={lShape.innerCutoutRadius || 0}
                  onChange={(e) =>
                    handlers.handleInnerCutoutRadiusChange(e.target.value)
                  }
                />
              </InputGroup>

              <InputGroup>
                <label>Pravý dolný roh (mm)</label>
                <input
                  type="number"
                  min="0"
                  max={radiusConstraints.rightBottomCutout}
                  value={lShape.rightBottomCutoutRadius || 0}
                  onChange={(e) =>
                    handlers.handleRightBottomCutoutRadiusChange(e.target.value)
                  }
                />
              </InputGroup>
            </InputsContainer>
          </>
        )}
      </LShapeContainer>
    )
  },
)

LShapeEditor.displayName = 'LShapeEditor'
