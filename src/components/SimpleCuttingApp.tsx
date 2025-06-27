import React, { useState } from 'react'
import styled from 'styled-components'
import { useSimpleConfigurator } from '../hooks/useSimpleConfigurator'
import { SimplePartForm } from './SimplePartForm'
import { SimplePartsList } from './SimplePartsList'
import { TabbedEditor } from './TabbedEditor'
import { SheetVisualization } from './SheetVisualization'
import { COLORS, TYPOGRAPHY, LAYOUT, SPACING, BREAKPOINTS } from '../utils/uiConstants'

const AppContainer = styled.div`
  max-width: ${LAYOUT.maxWidth};
  margin: 0 auto;
  padding: ${SPACING.xxl}px;
  font-family: ${TYPOGRAPHY.fontFamily.system};
  background: ${COLORS.background};
  min-height: 100vh;
`

const Header = styled.header`
  text-align: center;
  margin-bottom: ${SPACING.xxxl * 1.5}px;

  h1 {
    color: ${COLORS.textPrimary};
    font-size: ${TYPOGRAPHY.fontSize['3xl']};
    margin-bottom: ${SPACING.md}px;
  }

  p {
    color: ${COLORS.textSecondary};
    font-size: ${TYPOGRAPHY.fontSize.base};
    margin: 0;
  }
`

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${SPACING.xxl}px;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    grid-template-columns: 1fr;
  }
`

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.xxl}px;
`

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const SimpleCuttingApp: React.FC = () => {
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null)

  const {
    parts,
    sheetLayout,
    totalArea,
    totalParts,
    addPart,
    updatePart,
    removePart,
    clearAllParts,
  } = useSimpleConfigurator()

  const selectedPart = selectedPartId
    ? parts.find((p) => p.id === selectedPartId) || null
    : null

  return (
    <AppContainer>
      <Header>
        <h1>Konfigurátor porezu</h1>
        <p>Jednoduché nástroj pre plánovanie rozloženia dielcov na doske</p>
      </Header>

      <MainGrid>
        <LeftColumn>
          <SimplePartForm onAddPart={addPart} />

          <SimplePartsList
            parts={parts}
            totalArea={totalArea}
            totalParts={totalParts}
            selectedPartId={selectedPartId || undefined}
            onPartSelect={setSelectedPartId}
            onRemovePart={removePart}
            onClearAll={clearAllParts}
          />

          <TabbedEditor
            selectedPart={selectedPart}
            onPartUpdate={updatePart}
          />
        </LeftColumn>

        <RightColumn>
          <SheetVisualization sheetLayout={sheetLayout} />
        </RightColumn>
      </MainGrid>
    </AppContainer>
  )
}
