import React, { useState } from 'react';
import styled from 'styled-components';
import { useSimpleConfigurator } from '../hooks/useSimpleConfigurator';
import { SimplePartForm } from './SimplePartForm';
import { SimplePartsList } from './SimplePartsList';
import { TabbedEditor } from './TabbedEditor';
import { SheetVisualization } from './SheetVisualization';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: #f5f6fa;
  min-height: 100vh;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    color: #2c3e50;
    font-size: 2.2rem;
    margin-bottom: 8px;
  }
  
  p {
    color: #7f8c8d;
    font-size: 1rem;
    margin: 0;
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SimpleCuttingApp: React.FC = () => {
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  
  const {
    parts,
    sheetLayout,
    totalArea,
    totalParts,
    addPart,
    updatePart,
    removePart,
    clearAllParts
  } = useSimpleConfigurator();

  const selectedPart = selectedPartId ? parts.find(p => p.id === selectedPartId) || null : null;

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
  );
};
