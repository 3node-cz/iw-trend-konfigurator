import React from 'react'
import type { EnhancedCuttingPart } from '../../hooks/three-layer/useLayeredCuttingState'
import { SPACING } from '../../utils/uiConstants'
import { getAvailableBlockNumbers } from '../../utils/blockManagement'
import { validateBlockWidth } from '../../utils/blockValidation'
import { PartConfigIndicators } from './visual/PartConfigIndicators'
import {
  Card,
  CardTitle,
  GridContainer,
  EmptyStateContainer,
  DangerButton,
} from '../common/CommonStyles'
import {
  PartCard,
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
  RotationLabel,
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
  }) => {
    const availableBlocks = getAvailableBlockNumbers(enhancedParts)

    const handleBlockChange = (partId: string, blockId: string) => {
      const numericBlockId = blockId === '' ? undefined : parseInt(blockId, 10)
      onPartBlockUpdate(partId, numericBlockId)
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
          <EmptyStateContainer>
            <p>Zatiaľ nie sú pridané žiadne dielce</p>
          </EmptyStateContainer>
        </Card>
      )
    }

    return (
      <Card>
        <CardTitle>Zoznam dielcov</CardTitle>

        <StatsRow>
          <Stat>
            <span className="value">{enhancedParts.length}</span>
            <div className="label">Typov dielcov</div>
          </Stat>
          <Stat>
            <span className="value">{totalParts}</span>
            <div className="label">Kusov celkom</div>
          </Stat>
          <Stat>
            <span className="value">{(totalArea / 1000000).toFixed(2)} m²</span>
            <div className="label">Celková plocha</div>
          </Stat>
        </StatsRow>

        <GridContainer>
          {enhancedParts.map((part) => {
            const blockError = part.blockId
              ? validateBlockWidth(enhancedParts, part.blockId)
              : null

            return (
              <React.Fragment key={part.id}>
                <PartCard
                  $selected={selectedPartId === part.id}
                  onClick={() => onPartSelect(part.id)}
                >
                  {/* First row: Title and dimensions with indicators on the right */}
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

                  {/* Third row: Controls (Block, Rotation) */}
                  <PartControls>
                    <div>
                      {/* Hide block control only if frame is enabled */}
                      {!part.frame?.enabled && (
                        <BlockControlsContainer>
                          <BlockSelector
                            value={part.blockId || ''}
                            onChange={(e) =>
                              handleBlockChange(part.id, e.target.value)
                            }
                            onClick={(e) => e.stopPropagation()}
                            title="Priradiť k bloku pre zachovanie textúry dreva"
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
                      )}
                    </div>

                    {/* Hide rotation control if frame is enabled */}
                    {!part.frame?.enabled && (
                      <RotationLabel>
                        <input
                          type="checkbox"
                          checked={part.orientation === 'rotatable'}
                          onChange={(e) =>
                            handleRotationChange(part.id, e.target.checked)
                          }
                        />
                        Rotácia
                      </RotationLabel>
                    )}
                  </PartControls>

                  {/* Fourth row: Actions aligned to right */}
                  <PartActions>
                    <DangerButton
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemovePart(part.id)
                      }}
                    >
                      Odstrániť
                    </DangerButton>
                  </PartActions>
                </PartCard>

                {blockError && (
                  <BlockValidationError>{blockError}</BlockValidationError>
                )}
              </React.Fragment>
            )
          })}
        </GridContainer>

        <SpacedContainer $marginTop={SPACING.lg}>
          <DangerButton onClick={onClearAll}>Vymazať všetko</DangerButton>
        </SpacedContainer>
      </Card>
    )
  },
)
