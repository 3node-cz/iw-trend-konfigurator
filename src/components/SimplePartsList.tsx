import React from 'react'
import styled from 'styled-components'
import type { Part } from '../types/simple'
import { SPACING } from '../utils/uiConstants'
import {
  Card,
  CardTitle,
  GridContainer,
  SelectableItem,
  EmptyStateContainer,
  DangerButton,
  InfoText,
} from './common/CommonStyles'

// Specific styled components for parts list
const PartItem = styled(SelectableItem)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto auto auto;
  gap: 12px;
  align-items: center;
`

const PartInfo = styled.div`
  .label {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 2px;
  }

  .dimensions {
    font-size: 0.8rem;
    color: #7f8c8d;
  }
`

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: #e8f4fd;
  border-radius: 6px;
`

const Stat = styled.div`
  text-align: center;

  .value {
    font-size: 1.2rem;
    font-weight: 700;
    color: #2c3e50;
    display: block;
  }

  .label {
    font-size: 0.8rem;
    color: #7f8c8d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`

const ConfigIndicators = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`

const ConfigBadge = styled.span<{ $type: 'corners' | 'edges' | 'lshape' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  background-color: ${(props) => {
    switch (props.$type) {
      case 'corners':
        return '#9b59b6'
      case 'edges':
        return '#e67e22'
      case 'lshape':
        return '#27ae60'
      default:
        return '#95a5a6'
    }
  }};

  &:hover {
    transform: scale(1.1);
    transition: transform 0.1s;
  }
`

const ConfigTooltip = styled.div<{ $visible: boolean }>`
  position: absolute;
  background: #2c3e50;
  color: white;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  white-space: nowrap;
  z-index: 1000;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  visibility: ${(props) => (props.$visible ? 'visible' : 'hidden')};
  transition: opacity 0.2s, visibility 0.2s;
  transform: translateY(-100%);
  margin-top: -8px;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #2c3e50;
  }
`

interface ConfigIndicatorsProps {
  part: Part
}

const PartConfigIndicators: React.FC<ConfigIndicatorsProps> = ({ part }) => {
  const [hoveredBadge, setHoveredBadge] = React.useState<string | null>(null)

  return (
    <ConfigIndicators>
      {part.hasCornerModifications && (
        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setHoveredBadge('corners')}
          onMouseLeave={() => setHoveredBadge(null)}
        >
          <ConfigBadge $type="corners">C</ConfigBadge>
          <ConfigTooltip $visible={hoveredBadge === 'corners'}>
            Upravené rohy
          </ConfigTooltip>
        </div>
      )}

      {part.hasEdgeTreatments && (
        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setHoveredBadge('edges')}
          onMouseLeave={() => setHoveredBadge(null)}
        >
          <ConfigBadge $type="edges">E</ConfigBadge>
          <ConfigTooltip $visible={hoveredBadge === 'edges'}>
            Hrany s oblepovaním
          </ConfigTooltip>
        </div>
      )}

      {part.isLShape && (
        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setHoveredBadge('lshape')}
          onMouseLeave={() => setHoveredBadge(null)}
        >
          <ConfigBadge $type="lshape">L</ConfigBadge>
          <ConfigTooltip $visible={hoveredBadge === 'lshape'}>
            L-tvar
          </ConfigTooltip>
        </div>
      )}

      {!part.hasAdvancedConfig && (
        <span style={{ fontSize: '0.7rem', color: '#bdc3c7' }}>—</span>
      )}
    </ConfigIndicators>
  )
}

interface SimplePartsListProps {
  parts: Part[]
  totalArea: number
  totalParts: number
  selectedPartId?: string
  onPartSelect: (id: string) => void
  onRemovePart: (id: string) => void
  onClearAll: () => void
}

export const SimplePartsList: React.FC<SimplePartsListProps> = React.memo(
  ({
    parts,
    totalArea,
    totalParts,
    selectedPartId,
    onPartSelect,
    onRemovePart,
    onClearAll,
  }) => {
    if (parts.length === 0) {
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
            <span className="value">{parts.length}</span>
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
          {parts.map((part) => (
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

        <DangerButton onClick={onClearAll} style={{ marginTop: `${SPACING.lg}px` }}>
          Vymazať všetko
        </DangerButton>
      </Card>
    )
  },
)
