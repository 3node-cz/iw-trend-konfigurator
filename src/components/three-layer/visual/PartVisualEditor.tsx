import React from 'react'
import type { Part } from '../../../types/simple'
import { PartPreviewCanvas } from './PartVisualPreview'
import { EdgeSelector } from './EdgeVisualSelector'
import { CornerConfigurator } from './CornerVisualConfigurator'
import { createPartUpdateHandlers } from '../../../utils/partUpdates'
import { useDebounce } from '../../../hooks/useDebounce'
import {
  getPartLabel,
  formatPartDimensionsFromPart,
  getPartStats,
} from '../../../utils/partFormatting'
import {
  EditorContainer,
  EditorTitle,
  EmptyState,
  PartHeader,
} from './PartVisualEditor.styles'

interface PartEditorProps {
  selectedPart: Part | null
  onPartUpdate: (id: string, updates: Partial<Part>) => void
}

export const PartVisualEditor: React.FC<PartEditorProps> = React.memo(
  ({ selectedPart, onPartUpdate }) => {
    // Create debounced update handler at the top level
    const debouncedOnPartUpdate = useDebounce(onPartUpdate, 300)

    if (!selectedPart) {
      return (
        <EditorContainer>
          <EditorTitle>Úprava dielu</EditorTitle>
          <EmptyState>
            <p>Vyberte diel zo zoznamu pre úpravy rohov a hrán</p>
          </EmptyState>
        </EditorContainer>
      )
    }

    const { handleEdgeUpdate, handleCornerUpdate } = createPartUpdateHandlers(
      selectedPart,
      debouncedOnPartUpdate,
    )

    const partStats = getPartStats(selectedPart)

    return (
      <EditorContainer>
        <EditorTitle>Úprava dielu</EditorTitle>

        <PartHeader>
          <div className="part-info">
            <div className="label">{getPartLabel(selectedPart)}</div>
            <div className="dimensions">
              {formatPartDimensionsFromPart(selectedPart)}
            </div>
          </div>
          <div className="part-stats">
            <div>
              <strong>{partStats.quantity}</strong>
            </div>
            <div>{partStats.area}</div>
          </div>
        </PartHeader>

        <PartPreviewCanvas part={selectedPart} />

        <EdgeSelector
          part={selectedPart}
          onEdgeUpdate={handleEdgeUpdate}
        />

        <CornerConfigurator
          part={selectedPart}
          onCornerUpdate={handleCornerUpdate}
        />
      </EditorContainer>
    )
  },
)
