import React, { useState, useEffect } from 'react'
import type { Part } from '../../../types/simple'
import { PartVisualEditor } from './PartVisualEditor'
import { LShapeVisualEditor } from './LShapeVisualEditor'
import { FrameVisualEditor } from './FrameVisualEditor'
import { SPACING } from '../../../utils/uiConstants'
import {
  analyzePartConfiguration,
  enableBasicConfiguration,
  enableLShapeConfiguration,
  disableBasicConfiguration,
} from '../../../utils/configurationManagement'
import { getDefaultFrameConfig } from '../../../utils/frameCalculations'
import {
  TabContainer,
  TabHeader,
  TabButton,
  TabContent,
  ConfigurationSelector,
  CheckboxContainer,
  EmptyState,
  SpacedDiv,
} from './VisualEnhancementEditor.styles'

interface TabbedEditorProps {
  selectedPart: Part | null
  onPartUpdate: (id: string, updates: Partial<Part>) => void
}

type TabType = 'basic' | 'lshape' | 'frame'

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
      } else if (selectedPart.frame?.enabled) {
        setActiveTab('frame')
      } else if (configState.hasCornerConfig || configState.hasEdgeConfig) {
        setActiveTab('basic')
      } else {
        setActiveTab('basic') // Default to basic if no config
      }
    }, [selectedPart])

    const handleConfigurationToggle = (
      configType: 'basic' | 'lshape' | 'frame',
      enabled: boolean,
    ) => {
      if (!selectedPart) return

      if (configType === 'basic') {
        if (enabled) {
          const updates = enableBasicConfiguration(selectedPart)
          // Disable other configurations
          onPartUpdate(selectedPart.id, {
            ...updates,
            lShape: undefined,
            frame: undefined,
          })
          setActiveTab('basic')
        } else {
          const updates = disableBasicConfiguration(selectedPart)
          onPartUpdate(selectedPart.id, updates)
        }
      } else if (configType === 'lshape') {
        if (enabled) {
          const updates = enableLShapeConfiguration(selectedPart)
          // Disable other configurations
          onPartUpdate(selectedPart.id, {
            ...updates,
            frame: undefined,
          })
          setActiveTab('lshape')
        } else {
          // Disable L-shape
          onPartUpdate(selectedPart.id, {
            lShape: undefined,
          })
        }
      } else if (configType === 'frame') {
        if (enabled) {
          const defaultFrameConfig = getDefaultFrameConfig()
          // Disable other configurations
          const updates = disableBasicConfiguration(selectedPart)
          onPartUpdate(selectedPart.id, {
            ...updates,
            lShape: undefined,
            frame: { ...defaultFrameConfig, enabled: true, type: 'type1' },
          })
          setActiveTab('frame')
        } else {
          // Disable frame
          onPartUpdate(selectedPart.id, {
            frame: undefined,
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
        label: 'Rohy',
        hasConfig: configState.hasCornerConfig || configState.hasEdgeConfig,
      },
      {
        id: 'lshape' as TabType,
        label: 'L-tvar',
        hasConfig: configState.hasLShapeConfig,
      },
      {
        id: 'frame' as TabType,
        label: 'Rámček',
        hasConfig: selectedPart.frame?.enabled || false,
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
          {activeTab === 'frame' && (
            <div>
              <ConfigurationSelector>
                <CheckboxContainer>
                  <input
                    type="checkbox"
                    checked={selectedPart.frame?.enabled || false}
                    onChange={(e) =>
                      handleConfigurationToggle('frame', e.target.checked)
                    }
                  />
                  Použiť rámček konfiguráciu
                </CheckboxContainer>
              </ConfigurationSelector>

              {selectedPart.frame?.enabled && (
                <SpacedDiv $marginTop={SPACING.lg}>
                  <FrameVisualEditor
                    frameConfig={selectedPart.frame}
                    onFrameConfigChange={(frameConfig) =>
                      onPartUpdate(selectedPart.id, { frame: frameConfig })
                    }
                    partWidth={selectedPart.width}
                    partHeight={selectedPart.height}
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
