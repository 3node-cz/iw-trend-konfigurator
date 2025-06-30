import React from 'react'
import type { Part } from '../../types/simple'
import { SPACING } from '../../utils/uiConstants'
import {
  Card,
  CardTitle,
  GridContainer,
  EmptyStateContainer,
  DangerButton,
  InfoText,
} from '../common/CommonStyles'
import {
  PartItem,
  PartInfo,
  StatsRow,
  Stat,
  ConfigIndicators,
  ConfigBadge,
  ConfigTooltip,
  RelativeContainer,
  NoDataSpan,
  SpacedContainer,
} from './EnhancedPartsList.styles'

interface ConfigIndicatorsProps {
  part: Part
}

const PartConfigIndicators: React.FC<ConfigIndicatorsProps> = ({ part }) => {
  const [hoveredBadge, setHoveredBadge] = React.useState<string | null>(null)

  return (
    <ConfigIndicators>
      {part.hasCornerModifications && (
        <RelativeContainer
          onMouseEnter={() => setHoveredBadge('corners')}
          onMouseLeave={() => setHoveredBadge(null)}
        >
          <ConfigBadge $type="corners">C</ConfigBadge>
          <ConfigTooltip $visible={hoveredBadge === 'corners'}>
            Upravené rohy
          </ConfigTooltip>
        </RelativeContainer>
      )}

      {part.hasEdgeTreatments && (
        <RelativeContainer
          onMouseEnter={() => setHoveredBadge('edges')}
          onMouseLeave={() => setHoveredBadge(null)}
        >
          <ConfigBadge $type="edges">E</ConfigBadge>
          <ConfigTooltip $visible={hoveredBadge === 'edges'}>
            Hrany s oblepovaním
          </ConfigTooltip>
        </RelativeContainer>
      )}

      {part.isLShape && (
        <RelativeContainer
          onMouseEnter={() => setHoveredBadge('lshape')}
          onMouseLeave={() => setHoveredBadge(null)}
        >
          <ConfigBadge $type="lshape">L</ConfigBadge>
          <ConfigTooltip $visible={hoveredBadge === 'lshape'}>
            L-tvar
          </ConfigTooltip>
        </RelativeContainer>
      )}

      {!part.hasAdvancedConfig && <NoDataSpan>—</NoDataSpan>}
    </ConfigIndicators>
  )
}

interface EnhancedPartsListProps {
  enhancedParts: Part[]
  totalArea: number
  totalParts: number
  selectedPartId?: string
  onPartSelect: (id: string) => void
  onRemovePart: (id: string) => void
  onClearAll: () => void
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
  }) => {
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
          {enhancedParts.map((part) => (
            <PartItem
              key={part.id}
              $selected={selectedPartId === part.id}
              onClick={() => onPartSelect(part.id)}
            >
              <PartInfo>
                <div className="label">
                  {part.label || `Diel ${part.width}×${part.height}`}
                </div>
                <div className="dimensions">
                  {part.width} × {part.height} mm
                </div>
              </PartInfo>

              <InfoText>
                <strong>{part.quantity}</strong> ks
              </InfoText>

              <InfoText>
                {((part.width * part.height * part.quantity) / 1000000).toFixed(
                  3,
                )}{' '}
                m²
              </InfoText>

              <InfoText>
                {((part.width * part.height) / 1000000).toFixed(3)} m²/ks
              </InfoText>

              <DangerButton
                onClick={(e) => {
                  e.stopPropagation()
                  onRemovePart(part.id)
                }}
              >
                Odstrániť
              </DangerButton>

              <PartConfigIndicators part={part} />
            </PartItem>
          ))}
        </GridContainer>

        <SpacedContainer $marginTop={SPACING.lg}>
          <DangerButton onClick={onClearAll}>Vymazať všetko</DangerButton>
        </SpacedContainer>
      </Card>
    )
  },
)
