import React from 'react'
import type { Part } from '../../../types/simple'
import { ConfigBadge } from '../../common/ui/ConfigBadge'
import styled from 'styled-components'

const ConfigIndicators = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`

const NoDataSpan = styled.span`
  opacity: 0.5;
  font-style: italic;
`

interface ConfigIndicatorsProps {
  part: Part
}

export const PartConfigIndicators: React.FC<ConfigIndicatorsProps> = ({
  part,
}) => {
  return (
    <ConfigIndicators>
      {part.hasCornerModifications && (
        <ConfigBadge
          type="corners"
          tooltipText="Upravené rohy"
        >
          C
        </ConfigBadge>
      )}

      {part.hasEdgeTreatments && (
        <ConfigBadge
          type="edges"
          tooltipText="Hrany s oblepovaním"
        >
          H
        </ConfigBadge>
      )}

      {part.isLShape && (
        <ConfigBadge
          type="lshape"
          tooltipText="L-tvar"
        >
          L
        </ConfigBadge>
      )}

      {part.isFrame && (
        <ConfigBadge
          type="frame"
          tooltipText="Rámček"
        >
          F
        </ConfigBadge>
      )}

      {!part.hasAdvancedConfig && <NoDataSpan>—</NoDataSpan>}
    </ConfigIndicators>
  )
}
