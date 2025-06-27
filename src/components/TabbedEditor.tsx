import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PartEditor } from './PartEditor';
import { LShapeEditor } from './LShapeEditor';
import type { Part } from '../types/simple';

const TabContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
  margin-bottom: 20px;
  overflow: hidden;
`;

const TabHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #e1e8ed;
  background: #f8f9fa;
`;

const TabButton = styled.button<{ $active: boolean; $hasConfig?: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#2c3e50' : '#7f8c8d'};
  font-weight: ${props => props.$active ? '600' : '400'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: ${props => props.$active ? '2px solid #3498db' : '2px solid transparent'};
  position: relative;
  
  &:hover {
    background: ${props => props.$active ? 'white' : '#f1f2f6'};
    color: #2c3e50;
  }
  
  &:focus {
    outline: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 8px;
    right: 8px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #27ae60;
    opacity: ${props => props.$hasConfig ? 1 : 0};
    transition: opacity 0.2s;
  }
`;

const TabContent = styled.div`
  min-height: 200px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #7f8c8d;
  
  p {
    margin: 0;
    font-size: 1rem;
  }
`;

interface TabbedEditorProps {
  selectedPart: Part | null;
  onPartUpdate: (id: string, updates: Partial<Part>) => void;
}

type TabType = 'corners' | 'lshape';

export const TabbedEditor: React.FC<TabbedEditorProps> = ({ selectedPart, onPartUpdate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('corners');

  // Auto-switch tab based on part configuration when part is selected
  useEffect(() => {
    if (selectedPart) {
      // Determine the appropriate tab based on current configuration
      const hasLShapeConfig = selectedPart.isLShape || selectedPart.lShape?.enabled;
      const hasCornerOrEdgeConfig = selectedPart.hasCornerModifications || selectedPart.hasEdgeTreatments;
      
      // Priority: L-shape > Corner/Edge config > Default to corners for new parts
      if (hasLShapeConfig) {
        setActiveTab('lshape');
      } else if (hasCornerOrEdgeConfig) {
        setActiveTab('corners');
      } else {
        // For parts with no configuration, default to corners tab
        // This provides a better starting point for new users
        setActiveTab('corners');
      }
    }
  }, [selectedPart]); // Include the full selectedPart but this will only run when selecting different parts

  if (!selectedPart) {
    return (
      <TabContainer>
        <TabHeader>
          <TabButton $active={activeTab === 'corners'} onClick={() => setActiveTab('corners')}>
            Rohy a hrany
          </TabButton>
          <TabButton $active={activeTab === 'lshape'} onClick={() => setActiveTab('lshape')}>
            L-tvar
          </TabButton>
        </TabHeader>
        <TabContent>
          <EmptyState>
            <p>Vyberte diel pre úpravu rohov alebo L-tvaru</p>
            <p style={{ fontSize: '0.8rem', marginTop: '8px', fontStyle: 'italic' }}>
              Karta sa automaticky prepne podľa konfigurácie dielu
            </p>
          </EmptyState>
        </TabContent>
      </TabContainer>
    );
  }

  // Check if L-shape is enabled
  const isLShapeEnabled = selectedPart.lShape?.enabled;
  
  // Check configuration status for tab indicators
  const hasCornerOrEdgeConfig = selectedPart.hasCornerModifications || selectedPart.hasEdgeTreatments;
  const hasLShapeConfig = selectedPart.isLShape;

  const handleTabChange = (tab: TabType) => {
    if (tab === 'lshape') {
      // When switching to L-shape, ensure it's enabled and corners are disabled
      if (!isLShapeEnabled) {
        onPartUpdate(selectedPart.id, {
          lShape: {
            enabled: true,
            topLeftWidth: Math.min(200, Math.floor(selectedPart.width * 0.4)),
            topLeftHeight: Math.min(200, Math.floor(selectedPart.height * 0.4)),
            bottomRightWidth: Math.min(200, Math.floor(selectedPart.width * 0.4)),
            bottomRightHeight: Math.min(200, Math.floor(selectedPart.height * 0.4)),
            innerCornerRadius: 0
          },
          // Clear any corner modifications when enabling L-shape
          corners: {
            topLeft: { type: 'none' },
            topRight: { type: 'none' },
            bottomRight: { type: 'none' },
            bottomLeft: { type: 'none' }
          }
        });
      }
    } else if (tab === 'corners') {
      // When switching to corners, disable L-shape
      if (isLShapeEnabled) {
        onPartUpdate(selectedPart.id, {
          lShape: { enabled: false }
        });
      }
    }
    setActiveTab(tab);
  };

  return (
    <TabContainer>
      <TabHeader>
        <TabButton 
          $active={activeTab === 'corners'} 
          $hasConfig={hasCornerOrEdgeConfig}
          onClick={() => handleTabChange('corners')}
        >
          Rohy a hrany
        </TabButton>
        <TabButton 
          $active={activeTab === 'lshape'} 
          $hasConfig={hasLShapeConfig}
          onClick={() => handleTabChange('lshape')}
        >
          L-tvar
        </TabButton>
      </TabHeader>
      <TabContent>
        {activeTab === 'corners' && (
          <div style={{ padding: '0' }}>
            <PartEditor
              selectedPart={selectedPart}
              onPartUpdate={onPartUpdate}
            />
          </div>
        )}
        {activeTab === 'lshape' && (
          <div style={{ padding: '0' }}>
            <LShapeEditor
              selectedPart={selectedPart}
              onPartUpdate={onPartUpdate}
            />
          </div>
        )}
      </TabContent>
    </TabContainer>
  );
};
