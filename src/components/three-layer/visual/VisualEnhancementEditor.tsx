import React, { useState, useEffect } from 'react'
import type { Part } from '../../../types/simple'
import { PartVisualEditor } from './PartVisualEditor'
import { LShapeVisualEditor } from './LShapeVisualEditor'
import { SPACING } from '../../../utils/uiConstants'
import {
  analyzePartConfiguration,
  enableBasicConfiguration,
  enableLShapeConfiguration,
  disableBasicConfiguration,
} from '../../../utils/configurationManagement'
import {
  TabContainer,
  TabHeader,
  TabButton,
  TabContent,
  ConfigurationSelector,
  CheckboxContainer,
  WarningText,
  EmptyState,
  SpacedDiv,
} from './VisualEnhancementEditor.styles'

interface TabbedEditorProps {
  selectedPart: Part | null
  onPartUpdate: (id: string, updates: Partial<Part>) => void
}

type TabType = 'basic' | 'lshape'

export const VisualEnhancementEditor: React.FC<TabbedEditorProps> = React.memo(
  ({ selectedPart, onPartUpdate }) => {
    const [activeTab, setActiveTab] = useState<TabType>('basic')

    // Auto-switch tabs and reset based on selected part's active configuration
    useEffect(() => {
      if (!selectedPart) return

      const configState = analyzePartConfiguration(selectedPart)

      // Auto-switch to the active configuration tab
      if (configState.isLShapeConfigActive) {
        setActiveTab('lshape')
      } else if (configState.hasCornerConfig || configState.hasEdgeConfig) {
        setActiveTab('basic')
      } else {
        setActiveTab('basic') // Default to basic if no config
      }
    }, [selectedPart])

    const handleConfigurationToggle = (
      configType: 'basic' | 'lshape',
      enabled: boolean,
    ) => {
      if (!selectedPart) return

      if (configType === 'basic') {
        if (enabled) {
          const updates = enableBasicConfiguration(selectedPart)
          onPartUpdate(selectedPart.id, updates)
          setActiveTab('basic')
        } else {
          const updates = disableBasicConfiguration(selectedPart)
          onPartUpdate(selectedPart.id, updates)
        }
      } else if (configType === 'lshape') {
        if (enabled) {
          const updates = enableLShapeConfiguration(selectedPart)
          onPartUpdate(selectedPart.id, updates)
          setActiveTab('lshape')
        } else {
          // Disable L-shape
          onPartUpdate(selectedPart.id, {
            lShape: undefined,
          })
        }
      }
    }

    if (!selectedPart) {
      return <EmptyState>Vyberte diel pre úpravu parametrov</EmptyState>
    }

    // Get configuration state from utility
    const configState = analyzePartConfiguration(selectedPart)

    const tabs = [
      {
        id: 'basic' as TabType,
        label: 'Základné nastavenia',
        hasConfig: configState.hasCornerConfig || configState.hasEdgeConfig,
      },
      {
        id: 'lshape' as TabType,
        label: 'L-tvar',
        hasConfig: configState.hasLShapeConfig,
      },
    ]

    return (
      <TabContainer
        role="tabpanel"
        aria-label="Part Editor"
      >
        <TabHeader role="tablist">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              $active={activeTab === tab.id}
              $hasConfig={tab.hasConfig}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tab-content-${tab.id}`}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabHeader>

        <TabContent
          id={`tab-content-${activeTab}`}
          role="tabpanel"
        >
          {activeTab === 'basic' && (
            <div>
              <ConfigurationSelector>
                <CheckboxContainer>
                  <input
                    type="checkbox"
                    checked={configState.isBasicConfigActive}
                    onChange={(e) =>
                      handleConfigurationToggle('basic', e.target.checked)
                    }
                  />
                  Použiť základné nastavenia (rohy a hrany)
                </CheckboxContainer>
                {configState.isLShapeConfigActive && (
                  <WarningText>
                    Pozor: Aktivácia základných nastavení vymaže aktuálnu L-tvar
                    konfiguráciu
                  </WarningText>
                )}
              </ConfigurationSelector>

              {configState.isBasicConfigActive && (
                <SpacedDiv $marginTop={SPACING.lg}>
                  <PartVisualEditor
                    selectedPart={selectedPart}
                    onPartUpdate={onPartUpdate}
                  />
                </SpacedDiv>
              )}
            </div>
          )}
          {activeTab === 'lshape' && (
            <div>
              <ConfigurationSelector>
                <CheckboxContainer>
                  <input
                    type="checkbox"
                    checked={configState.isLShapeConfigActive}
                    onChange={(e) =>
                      handleConfigurationToggle('lshape', e.target.checked)
                    }
                  />
                  Použiť L-tvar konfiguráciu
                </CheckboxContainer>
                {configState.isBasicConfigActive && (
                  <WarningText>
                    Pozor: Aktivácia L-tvaru vymaže aktuálne nastavenia rohov a
                    hrán
                  </WarningText>
                )}
              </ConfigurationSelector>

              {configState.isLShapeConfigActive && (
                <SpacedDiv $marginTop={SPACING.lg}>
                  <LShapeVisualEditor
                    selectedPart={selectedPart}
                    onPartUpdate={onPartUpdate}
                  />
                </SpacedDiv>
              )}
            </div>
          )}
        </TabContent>
      </TabContainer>
    )
  },
)
