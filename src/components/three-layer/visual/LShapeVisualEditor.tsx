import React from 'react'
import type { Part, LShapeConfig } from '../../../types/simple'
import { useDebounce } from '../../../hooks/useDebounce'
import { calculateLShapePreview } from '../../../utils/lShapePreview'
import { renderLShapeSvg } from '../../../utils/lShapeSvgRenderer.tsx'
import {
  getLShapeConstraints,
  createLShapeUpdateHandlers,
} from '../../../utils/lShapeValidation'
import { getLShapeRadiusConstraints } from '../../../utils/lShapeRadiusCalculations'
import {
  LShapeContainer,
  LShapeTitle,
  DimensionsHeader,
  PreviewContainer,
  InputsContainer,
  InputGroup,
  SectionHeader,
  EmptyStateMessage,
} from './LShapeVisualEditor.styles'

interface LShapeEditorProps {
  selectedPart: Part | null
  onPartUpdate: (id: string, updates: Partial<Part>) => void
}

export const LShapeVisualEditor: React.FC<LShapeEditorProps> = React.memo(
  ({ selectedPart, onPartUpdate }) => {
    // Create debounced update handler at the top level
    const handleLShapeUpdate = (updates: Partial<LShapeConfig>) => {
      if (!selectedPart) return
      const currentLShape = selectedPart.lShape || { enabled: false }
      onPartUpdate(selectedPart.id, {
        lShape: { ...currentLShape, ...updates },
      })
    }

    const debouncedHandleLShapeUpdate = useDebounce(handleLShapeUpdate, 300)

    if (!selectedPart) {
      return (
        <LShapeContainer>
          <LShapeTitle>L-tvar konfigurátor</LShapeTitle>
          <EmptyStateMessage>
            <p>Vyberte diel pre úpravu L-tvaru</p>
          </EmptyStateMessage>
        </LShapeContainer>
      )
    }

    const lShape = selectedPart.lShape

    const constraints = getLShapeConstraints(
      selectedPart.width,
      selectedPart.height,
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

    const handlers = createLShapeUpdateHandlers(debouncedHandleLShapeUpdate)

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

    // Don't render anything if L-shape is not enabled (controlled by parent)
    if (!lShape?.enabled) {
      return null
    }

    return (
      <LShapeContainer>
        <LShapeTitle>L-tvar konfigurátor</LShapeTitle>

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
              onChange={(e) => handlers.handleLeftWidthChange(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <label>Šířka pravé dolní části (mm)</label>
            <input
              type="number"
              min="0"
              max={constraints.maxWidth}
              value={lShape.rightWidth || 0}
              onChange={(e) => handlers.handleRightWidthChange(e.target.value)}
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
      </LShapeContainer>
    )
  },
)

LShapeVisualEditor.displayName = 'LShapeVisualEditor'
