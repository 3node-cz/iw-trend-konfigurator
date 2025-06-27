import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import type { Part } from '../types/simple';
import { FORM_DEFAULTS, PART_CONSTRAINTS } from '../utils/appConstants';

const FormContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
  margin-bottom: 20px;
`;

const FormTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.3rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 4px;
  color: #2c3e50;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const SubmitButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2980b9;
  }
  
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 2px;
`;

interface PartFormData {
  width: number;
  height: number;
  quantity: number;
  label?: string;
}

interface SimplePartFormProps {
  onAddPart: (part: Omit<Part, 'id'>) => void;
}

export const SimplePartForm: React.FC<SimplePartFormProps> = ({ onAddPart }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<PartFormData>({
    mode: 'onChange',
    defaultValues: {
      quantity: FORM_DEFAULTS.quantity
    }
  });

  const onSubmit = (data: PartFormData) => {
    onAddPart({
      width: data.width,
      height: data.height,
      quantity: data.quantity,
      label: data.label || undefined
    });
    reset({ quantity: FORM_DEFAULTS.quantity });
  };

  return (
    <FormContainer>
      <FormTitle>Pridať nový diel</FormTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGrid>
          <FormField>
            <Label htmlFor="width">Šírka (mm)</Label>
            <Input
              id="width"
              type="number"
              min={PART_CONSTRAINTS.minWidth}
              max={PART_CONSTRAINTS.maxWidth}
              {...register('width', {
                required: 'Šírka je povinná',
                min: { value: PART_CONSTRAINTS.minWidth, message: `Min ${PART_CONSTRAINTS.minWidth}mm` },
                max: { value: PART_CONSTRAINTS.maxWidth, message: `Max ${PART_CONSTRAINTS.maxWidth}mm` }
              })}
            />
            {errors.width && <ErrorMessage>{errors.width.message}</ErrorMessage>}
          </FormField>

          <FormField>
            <Label htmlFor="height">Výška (mm)</Label>
            <Input
              id="height"
              type="number"
              min={PART_CONSTRAINTS.minHeight}
              max={PART_CONSTRAINTS.maxHeight}
              {...register('height', {
                required: 'Výška je povinná',
                min: { value: PART_CONSTRAINTS.minHeight, message: `Min ${PART_CONSTRAINTS.minHeight}mm` },
                max: { value: PART_CONSTRAINTS.maxHeight, message: `Max ${PART_CONSTRAINTS.maxHeight}mm` }
              })}
            />
            {errors.height && <ErrorMessage>{errors.height.message}</ErrorMessage>}
          </FormField>

          <FormField>
            <Label htmlFor="quantity">Počet kusov</Label>
            <Input
              id="quantity"
              type="number"
              min={PART_CONSTRAINTS.minQuantity}
              max={PART_CONSTRAINTS.maxQuantity}
              {...register('quantity', {
                required: 'Počet je povinný',
                min: { value: PART_CONSTRAINTS.minQuantity, message: `Min ${PART_CONSTRAINTS.minQuantity}` },
                max: { value: PART_CONSTRAINTS.maxQuantity, message: `Max ${PART_CONSTRAINTS.maxQuantity}` }
              })}
            />
            {errors.quantity && <ErrorMessage>{errors.quantity.message}</ErrorMessage>}
          </FormField>

          <FormField className="full-width">
            <Label htmlFor="label">Názov dielu (voliteľné)</Label>
            <Input
              id="label"
              type="text"
              placeholder="napr. Polička, Dvierka..."
              {...register('label')}
            />
          </FormField>
        </FormGrid>

        <SubmitButton type="submit" disabled={!isValid}>
          Pridať diel
        </SubmitButton>
      </form>
    </FormContainer>
  );
};
