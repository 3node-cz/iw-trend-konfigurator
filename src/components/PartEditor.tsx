import React from 'react'
import styled from 'styled-components'
import type { Part } from '../types/simple'
import { PartPreviewCanvas } from './PartPreviewCanvas'
import { EdgeSelector } from './EdgeSelector'
import { CornerConfigurator } from './CornerConfigurator'
import { createPartUpdateHandlers } from '../utils/partUpdates'
import {
  getPartLabel,
  formatPartDimensions,
  getPartStats,
} from '../utils/partFormatting'

const EditorContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
  margin-bottom: 20px;
`

const EditorTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.3rem;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #7f8c8d;

  p {
    margin: 0;
    font-size: 1rem;
  }
`

const PartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e1e8ed;
  margin-bottom: 20px;

  .part-info {
    .label {
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 2px;
    }

    .dimensions {
      font-size: 0.9rem;
      color: #7f8c8d;
    }
  }

  .part-stats {
    text-align: right;
    font-size: 0.9rem;
    color: #7f8c8d;

    div {
      margin-bottom: 2px;
    }
  }
`

interface PartEditorProps {
  selectedPart: Part | null
  onPartUpdate: (id: string, updates: Partial<Part>) => void
}

export const PartEditor: React.FC<PartEditorProps> = React.memo(
  ({ selectedPart, onPartUpdate }) => {
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
      onPartUpdate,
    )

    const partStats = getPartStats(selectedPart)

    return (
      <EditorContainer>
        <EditorTitle>Úprava dielu</EditorTitle>

        <PartHeader>
          <div className="part-info">
            <div className="label">{getPartLabel(selectedPart)}</div>
            <div className="dimensions">
              {formatPartDimensions(selectedPart)}
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
