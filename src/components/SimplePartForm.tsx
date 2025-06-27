import React from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import type { Part } from '../types/simple'
import { FORM_DEFAULTS, PART_CONSTRAINTS } from '../utils/appConstants'
import {
  Card,
  CardTitle,
  InputGroup,
  PrimaryButton,
} from './common/CommonStyles'

// Form-specific styled components
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FormField = styled(InputGroup)`
  &.full-width {
    grid-column: 1 / -1;
  }
`

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 2px;
`

interface PartFormData {
  width: number
  height: number
  quantity: number
  label?: string
}

interface SimplePartFormProps {
  onAddPart: (part: Omit<Part, 'id'>) => void
}

export const SimplePartForm: React.FC<SimplePartFormProps> = ({
  onAddPart,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<PartFormData>({
    mode: 'onChange',
    defaultValues: {
      quantity: FORM_DEFAULTS.quantity,
    },
  })

  const onSubmit = (data: PartFormData) => {
    onAddPart({
      width: data.width,
      height: data.height,
      quantity: data.quantity,
      label: data.label || undefined,
    })
    reset({ quantity: FORM_DEFAULTS.quantity })
  }

  return (
    <Card>
      <CardTitle>Pridať nový diel</CardTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGrid>
          <FormField>
            <label htmlFor="width">Šírka (mm)</label>
            <input
              id="width"
              type="number"
              min={PART_CONSTRAINTS.minWidth}
              max={PART_CONSTRAINTS.maxWidth}
              {...register('width', {
                required: 'Šírka je povinná',
                min: {
                  value: PART_CONSTRAINTS.minWidth,
                  message: `Min ${PART_CONSTRAINTS.minWidth}mm`,
                },
                max: {
                  value: PART_CONSTRAINTS.maxWidth,
                  message: `Max ${PART_CONSTRAINTS.maxWidth}mm`,
                },
              })}
            />
            {errors.width && (
              <ErrorMessage>{errors.width.message}</ErrorMessage>
            )}
          </FormField>

          <FormField>
            <label htmlFor="height">Výška (mm)</label>
            <input
              id="height"
              type="number"
              min={PART_CONSTRAINTS.minHeight}
              max={PART_CONSTRAINTS.maxHeight}
              {...register('height', {
                required: 'Výška je povinná',
                min: {
                  value: PART_CONSTRAINTS.minHeight,
                  message: `Min ${PART_CONSTRAINTS.minHeight}mm`,
                },
                max: {
                  value: PART_CONSTRAINTS.maxHeight,
                  message: `Max ${PART_CONSTRAINTS.maxHeight}mm`,
                },
              })}
            />
            {errors.height && (
              <ErrorMessage>{errors.height.message}</ErrorMessage>
            )}
          </FormField>

          <FormField>
            <label htmlFor="quantity">Počet kusov</label>
            <input
              id="quantity"
              type="number"
              min={PART_CONSTRAINTS.minQuantity}
              max={PART_CONSTRAINTS.maxQuantity}
              {...register('quantity', {
                required: 'Počet je povinný',
                min: {
                  value: PART_CONSTRAINTS.minQuantity,
                  message: `Min ${PART_CONSTRAINTS.minQuantity}`,
                },
                max: {
                  value: PART_CONSTRAINTS.maxQuantity,
                  message: `Max ${PART_CONSTRAINTS.maxQuantity}`,
                },
              })}
            />
            {errors.quantity && (
              <ErrorMessage>{errors.quantity.message}</ErrorMessage>
            )}
          </FormField>

          <FormField className="full-width">
            <label htmlFor="label">Názov dielu (voliteľné)</label>
            <input
              id="label"
              type="text"
              placeholder="napr. Polička, Dvierka..."
              {...register('label')}
            />
          </FormField>
        </FormGrid>

        <PrimaryButton
          type="submit"
          disabled={!isValid}
        >
          Pridať diel
        </PrimaryButton>
      </form>
    </Card>
  )
}
