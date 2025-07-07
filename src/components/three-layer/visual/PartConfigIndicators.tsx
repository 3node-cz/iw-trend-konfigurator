import React from 'react'
import type { Part } from '../../../types/simple'
import {
  ConfigIndicators,
  ConfigBadge,
  ConfigTooltip,
  RelativeContainer,
  NoDataSpan,
} from '../EnhancedPartsList.styles'

interface ConfigIndicatorsProps {
  part: Part
}

export const PartConfigIndicators: React.FC<ConfigIndicatorsProps> = ({
  part,
}) => {
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
