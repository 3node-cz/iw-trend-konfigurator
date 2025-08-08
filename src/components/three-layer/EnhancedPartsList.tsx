import React from 'react'
import type { EnhancedCuttingPart } from '../../hooks/three-layer/useLayeredCuttingState'
import type { EdgeValue } from '../../utils/edgeConstants'
import { SPACING } from '../../utils/uiConstants'
import { MATERIAL_CONFIG } from '../../config/appConfig'
import { getAvailableBlockNumbers } from '../../utils/blockManagement'
import {
  validateBlockWidth,
  validateBlockWoodType,
} from '../../utils/blockValidation'
import { PartConfigIndicators } from './visual/PartConfigIndicators'
import { CompactPartPreview } from './visual/CompactPartPreview'
import { EdgeFormSelector } from './visual/EdgeFormSelector'
import {
  Card,
  CardTitle,
  GridContainer,
  EmptyState,
  Button,
  RotationToggle,
} from '../common/ui'
import {
  PartCard,
  PartCardContent,
  PartPreviewSection,
  PartTitle,
  PartDimensions,
  PartMetrics,
  PartMetric,
  PartControls,
  PartActions,
  StatsRow,
  Stat,
  BlockIndicator,
  BlockValidationError,
  ColorIndicator,
  BlockControlsContainer,
  BlockSelector,
  WoodTypeSelector,
  SpacedContainer,
} from './EnhancedPartsList.styles'

interface EnhancedPartsListProps {
  enhancedParts: EnhancedCuttingPart[]
  totalArea: number
  totalParts: number
  selectedPartId?: string
  onPartSelect: (id: string) => void
  onRemovePart: (id: string) => void
  onClearAll: () => void
  onPartBlockUpdate: (partId: string, blockId: number | undefined) => void
  onPartRotationUpdate: (partId: string, rotatable: boolean) => void
  onPartWoodTypeUpdate: (partId: string, woodType: string) => void
  onPartEdgeUpdate: (partId: string, edge: string, value: EdgeValue) => void
}

export const EnhancedPartsList: React.FC<EnhancedPartsListProps> = React.memo(
  ({
    enhancedParts,
    totalArea,
    totalParts,
    selectedPartId,
    onPartSelect,
    onRemovePart,
    onClearAll,
    onPartBlockUpdate,
    onPartRotationUpdate,
    onPartWoodTypeUpdate,
    onPartEdgeUpdate,
  }) => {
    const availableBlocks = getAvailableBlockNumbers(enhancedParts)

    const handleBlockChange = (partId: string, blockId: string) => {
      const numericBlockId = blockId === '' ? undefined : parseInt(blockId, 10)
      onPartBlockUpdate(partId, numericBlockId)
    }

    const handleWoodTypeChange = (partId: string, woodType: string) => {
      onPartWoodTypeUpdate(partId, woodType)
    }

    const handleRotationChange = (partId: string, rotatable: boolean) => {
      const part = enhancedParts.find((p) => p.id === partId)
      if (!part) return

      // If part is in a block, update all parts in that block
      if (part.blockId) {
        enhancedParts.forEach((p) => {
          if (p.blockId === part.blockId) {
            onPartRotationUpdate(p.id, rotatable)
          }
        })
      } else {
        // Update only this part
        onPartRotationUpdate(partId, rotatable)
      }
    }

    if (enhancedParts.length === 0) {
      return (
        <Card>
          <CardTitle>Zoznam dielcov</CardTitle>
          <EmptyState
            title="Prázdny zoznam"
            message="Zatiaľ nie sú pridané žiadne dielce"
          />
        </Card>
      )
    }

    return (
      <Card>
        <CardTitle>Zoznam dielcov</CardTitle>

        <StatsRow>
          <Stat>
            <div className="value">{enhancedParts.length}</div>
            <div className="label">Typov dielcov</div>
          </Stat>
          <Stat>
            <div className="value">{totalParts}</div>
            <div className="label">Kusov celkom</div>
          </Stat>
          <Stat>
            <div className="value">{(totalArea / 1000000).toFixed(2)} m²</div>
            <div className="label">Celková plocha</div>
          </Stat>
        </StatsRow>

        <GridContainer>
          {enhancedParts.map((part) => {
            const blockErrors: string[] = []

            if (part.blockId) {
              const widthError = validateBlockWidth(enhancedParts, part.blockId)
              if (widthError) blockErrors.push(widthError)

              const woodTypeError = validateBlockWoodType(
                enhancedParts,
                part.blockId,
              )
              if (woodTypeError) blockErrors.push(woodTypeError)
            }

            return (
              <React.Fragment key={part.id}>
                <PartCard
                  $selected={selectedPartId === part.id}
                  onClick={() => onPartSelect(part.id)}
                >
                  {/* Left side: All part content */}
                  <PartCardContent>
                    {/* First row: Title and dimensions with config indicators */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ColorIndicator $color={part.color || '#3498db'} />
                        <div>
                          <PartTitle>
                            {part.label || `Diel ${part.width}×${part.height}`}
                          </PartTitle>
                          <PartDimensions>
                            {part.width} × {part.height} mm
                          </PartDimensions>
                        </div>
                      </div>
                      <PartConfigIndicators part={part} />
                    </div>

                  {/* Second row: Metrics side by side */}
                  <PartMetrics>
                    <PartMetric>
                      <div className="value">{part.quantity}</div>
                      <div className="label">ks</div>
                    </PartMetric>
                    <PartMetric>
                      <div className="value">
                        {(
                          (part.width * part.height * part.quantity) /
                          1000000
                        ).toFixed(3)}
                      </div>
                      <div className="label">m²</div>
                    </PartMetric>
                    <PartMetric>
                      <div className="value">
                        {((part.width * part.height) / 1000000).toFixed(3)}
                      </div>
                      <div className="label">m²/ks</div>
                    </PartMetric>
                  </PartMetrics>

                  {/* Third row: Controls (Block, Wood Type, Rotation) */}
                  <PartControls>
                    {/* Block selector - hidden if frame is enabled */}
                    {!part.frame?.enabled ? (
                      <BlockControlsContainer>
                        <BlockSelector
                          value={part.blockId || ''}
                          onChange={(e) =>
                            handleBlockChange(part.id, e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                          title="Priradiť k bloku pre zoskupenie na doske"
                        >
                          <option value="">Bez bloku</option>
                          {availableBlocks.map((blockNum) => (
                            <option
                              key={blockNum}
                              value={blockNum}
                            >
                              Blok {blockNum}
                            </option>
                          ))}
                        </BlockSelector>
                        {part.blockId && (
                          <BlockIndicator
                            $blockId={part.blockId}
                            $color={part.color}
                          >
                            {part.blockId}
                          </BlockIndicator>
                        )}
                      </BlockControlsContainer>
                    ) : (
                      <div></div>
                    )}

                    {/* Wood Type Selector - Always visible */}
                    <WoodTypeSelector
                      value={part.woodType || MATERIAL_CONFIG.defaultWoodType}
                      onChange={(e) =>
                        handleWoodTypeChange(part.id, e.target.value)
                      }
                      onClick={(e) => e.stopPropagation()}
                      title="Typ dreva pre materiál"
                    >
                      {MATERIAL_CONFIG.woodTypes.map((wood) => (
                        <option
                          key={wood.id}
                          value={wood.id}
                        >
                          {wood.name}
                        </option>
                      ))}
                    </WoodTypeSelector>

                    {/* Rotation control - hidden if frame is enabled */}
                    {!part.frame?.enabled ? (
                      <RotationToggle
                        checked={part.orientation === 'rotatable'}
                        onChange={(checked) =>
                          handleRotationChange(part.id, checked)
                        }
                      />
                    ) : (
                      <div></div>
                    )}
                  </PartControls>

                  {/* Edge Configuration Row */}
                  <div style={{ marginTop: '12px', width: '100%' }}>
                    <EdgeFormSelector
                      edges={part.edges}
                      onEdgeUpdate={(edge, value) => onPartEdgeUpdate(part.id, edge, value)}
                      size="small"
                      orientation="horizontal"
                    />
                  </div>

                  {/* Fourth row: Actions aligned to right */}
                  <PartActions>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        onRemovePart(part.id)
                      }}
                    >
                      Odstrániť
                    </Button>
                  </PartActions>
                  </PartCardContent>

                  {/* Right side: Part preview taking full height */}
                  <PartPreviewSection>
                    <CompactPartPreview part={part} size={120} />
                  </PartPreviewSection>
                </PartCard>

                {blockErrors.length > 0 && (
                  <div>
                    {blockErrors.map((error, index) => (
                      <BlockValidationError key={index}>
                        {error}
                      </BlockValidationError>
                    ))}
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </GridContainer>

        <SpacedContainer $marginTop={SPACING.lg}>
          <Button
            variant="danger"
            onClick={onClearAll}
          >
            Vymazať všetko
          </Button>
        </SpacedContainer>
      </Card>
    )
  },
)
