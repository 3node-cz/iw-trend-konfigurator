import React from 'react'
import { useForm } from 'react-hook-form'
import type { Part } from '../../../types/simple'
import { FORM_DEFAULTS, PART_CONSTRAINTS } from '../../../utils/appConstants'
import type { PartFormData } from '../../../utils/formValidation'
import {
  getWidthValidationRules,
  getHeightValidationRules,
  getQuantityValidationRules,
  transformFormDataToPart,
} from '../../../utils/formValidation'
import { Card, CardTitle, PrimaryButton } from '../../common/CommonStyles'
import { FormGrid, FormField, ErrorMessage } from './DimensionalPartForm.styles'
interface DimensionalPartFormProps {
  onAddPart: (part: Omit<Part, 'id'>) => void
}

export const DimensionalPartForm: React.FC<DimensionalPartFormProps> = ({
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
    onAddPart(transformFormDataToPart(data))
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
              {...register('width', getWidthValidationRules())}
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
              {...register('height', getHeightValidationRules())}
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
              {...register('quantity', getQuantityValidationRules())}
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
