import React from 'react'
import { useForm } from 'react-hook-form'
import type { Part } from '../../../types/simple'
import type { EdgeValue } from '../../../utils/edgeConstants'
import { MATERIAL_CONFIG } from '../../../config/appConfig'
import {
  FORM_DEFAULTS,
  PART_CONSTRAINTS,
  SHEET_CONSTRAINTS,
} from '../../../utils/appConstants'
import { getAvailableBlockNumbers } from '../../../utils/blockManagement'
import type { PartFormData } from '../../../utils/formValidation'
import {
  getWidthValidationRules,
  getHeightValidationRules,
  getQuantityValidationRules,
  transformFormDataToPart,
} from '../../../utils/formValidation'
import {
  Card,
  CardTitle,
  Button,
  FormField,
  Toggle,
  Input,
} from '../../common/ui'
import {
  FormGrid,
  ButtonRow,
  NameInputContainer,
  CardHeader,
  EdgeContainer,
} from './DimensionalPartForm.styles'
import {
  BlockSelector,
  WoodTypeSelector,
  BlockControlsContainer,
} from '../EnhancedPartsList.styles'
import { EdgeFormSelector } from '../visual/EdgeFormSelector'
import styled from 'styled-components'

// Create a special wrapper for the toggle to ensure optical vertical centering
const ToggleWrapper = styled.div`
  height: 36px; /* Match the input height */
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  /* Position toggle to align with input center - optical adjustment */
  padding-top: 9px; /* Slightly less than mathematical center for better visual alignment */
`
interface DimensionalPartFormProps {
  onAddPart: (part: Omit<Part, 'id'>) => void
  existingParts?: Part[] // For generating available block numbers
}

export const DimensionalPartForm: React.FC<DimensionalPartFormProps> = ({
  onAddPart,
  existingParts = [],
}) => {
  const availableBlocks = getAvailableBlockNumbers(existingParts)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<PartFormData>({
    mode: 'onChange',
    defaultValues: {
      quantity: FORM_DEFAULTS.quantity,
      rotatable: true,
      woodType: MATERIAL_CONFIG.defaultWoodType,
      blockId: undefined, // Explicitly set to undefined to ensure "Bez bloku" is selected by default
      edges: {
        top: 'none',
        right: 'none',
        bottom: 'none',
        left: 'none',
      },
    },
  })

  // Watch edges for controlled updates
  const currentEdges = watch('edges')

  const handleEdgeUpdate = (edge: string, value: EdgeValue) => {
    const edgePath = `edges.${edge}` as keyof PartFormData
    setValue(edgePath, value, { shouldValidate: true })
  }

  const onSubmit = (data: PartFormData) => {
    // Ensure all values are numbers, not strings
    const partData = transformFormDataToPart({
      ...data,
      width: Number(data.width),
      height: Number(data.height),
      quantity: Number(data.quantity),
      blockId: data.blockId || undefined,
    })

    onAddPart(partData)
    reset({
      quantity: FORM_DEFAULTS.quantity,
      rotatable: true,
      woodType: MATERIAL_CONFIG.defaultWoodType,
      blockId: undefined, // Clear block selection to "Bez bloku"
      width: undefined, // Clear width field
      height: undefined, // Clear height field
      label: '', // Clear label field
      edges: {
        top: 'none',
        right: 'none',
        bottom: 'none',
        left: 'none',
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pridať nový diel</CardTitle>
        <NameInputContainer>
          <FormField
            label="Názov dielu (voliteľné)"
            htmlFor="label"
          >
            <Input
              id="label"
              type="text"
              placeholder="napr. Polička, Dvierka..."
              {...register('label')}
            />
          </FormField>
        </NameInputContainer>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGrid>
          {/* Row 1: Basic dimensions - thirds layout */}
          <FormField
            label="Šírka (mm)"
            htmlFor="width"
            error={errors.width?.message}
            required
          >
            <Input
              id="width"
              type="number"
              min={PART_CONSTRAINTS.minWidth}
              max={Math.min(
                PART_CONSTRAINTS.maxWidth,
                SHEET_CONSTRAINTS.standardWidth,
              )}
              {...register('width', {
                ...getWidthValidationRules(SHEET_CONSTRAINTS.standardWidth),
                valueAsNumber: true,
              })}
            />
          </FormField>

          <FormField
            label="Výška (mm)"
            htmlFor="height"
            error={errors.height?.message}
            required
          >
            <Input
              id="height"
              type="number"
              min={PART_CONSTRAINTS.minHeight}
              max={Math.min(
                PART_CONSTRAINTS.maxHeight,
                SHEET_CONSTRAINTS.standardHeight,
              )}
              {...register('height', {
                ...getHeightValidationRules(SHEET_CONSTRAINTS.standardHeight),
                valueAsNumber: true,
              })}
            />
          </FormField>

          <FormField
            label="Počet kusov"
            htmlFor="quantity"
            error={errors.quantity?.message}
            required
          >
            <Input
              id="quantity"
              type="number"
              min={PART_CONSTRAINTS.minQuantity}
              max={PART_CONSTRAINTS.maxQuantity}
              {...register('quantity', {
                ...getQuantityValidationRules(),
                valueAsNumber: true,
              })}
            />
          </FormField>

          {/* Row 2: Configuration options - thirds layout */}
          <FormField
            label="Blok"
            htmlFor="blockId"
          >
            <BlockControlsContainer>
              <BlockSelector
                id="blockId"
                defaultValue="" // Force "Bez bloku" to be selected by default
                {...register('blockId', {
                  setValueAs: (value) =>
                    value === '' ? undefined : Number(value),
                })}
                title="Priradiť k bloku pre zoskupenie na doske"
              >
                <option value="">Bez bloku</option>
                {availableBlocks.map((blockNum) => (
                  <option
                    key={blockNum}
                    value={blockNum}
                  >
                    Blok {blockNum}
                  </option>
                ))}
              </BlockSelector>
            </BlockControlsContainer>
          </FormField>

          <FormField
            label="Typ dreva"
            htmlFor="woodType"
          >
            <WoodTypeSelector
              id="woodType"
              {...register('woodType')}
              title="Typ dreva pre materiál"
            >
              {MATERIAL_CONFIG.woodTypes.map((wood) => (
                <option
                  key={wood.id}
                  value={wood.id}
                >
                  {wood.name}
                </option>
              ))}
            </WoodTypeSelector>
          </FormField>

          <FormField
            label="Rotácia"
            htmlFor="rotatable"
          >
            <ToggleWrapper className="toggle-container">
              <Toggle
                id="rotatable"
                checked={!!watch('rotatable')}
                onChange={(checked) => setValue('rotatable', checked)}
                size="small" /* Use small size for better proportions */
              />
            </ToggleWrapper>
          </FormField>

          {/* Row 3: Edge Configuration (full width) */}
          <EdgeContainer>
            <FormField label="Hrany">
              <EdgeFormSelector
                edges={currentEdges}
                onEdgeUpdate={handleEdgeUpdate}
                size="small"
                orientation="horizontal"
              />
            </FormField>
          </EdgeContainer>
        </FormGrid>

        {/* Button row */}
        <ButtonRow>
          <Button
            type="submit"
            variant="primary"
            disabled={!isValid}
          >
            Pridať diel
          </Button>
        </ButtonRow>
      </form>
    </Card>
  )
}
