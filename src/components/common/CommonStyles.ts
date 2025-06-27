import styled from 'styled-components'
import { COLORS, SPACING, BORDER_RADIUS, BOX_SHADOW, TYPOGRAPHY, INPUT_DIMENSIONS, COMPONENT_DIMENSIONS } from '../../utils/uiConstants'

// Common container styles
export const Card = styled.div`
  background: ${COLORS.cardBackground};
  border-radius: ${COMPONENT_DIMENSIONS.card.borderRadius}px;
  padding: ${COMPONENT_DIMENSIONS.card.padding}px;
  box-shadow: ${BOX_SHADOW.light};
  border: 1px solid ${COLORS.border};
  margin-bottom: ${COMPONENT_DIMENSIONS.card.marginBottom}px;
`

export const CardTitle = styled.h2`
  color: ${COLORS.textPrimary};
  margin-bottom: ${SPACING.xl}px;
  font-size: ${TYPOGRAPHY.fontSize.xl};
`

export const SectionHeader = styled.h3`
  color: ${COLORS.textPrimary};
  font-size: ${TYPOGRAPHY.fontSize.lg};
  margin: ${SPACING.xxl}px 0 ${SPACING.xl}px 0;
  padding-bottom: ${SPACING.md}px;
  border-bottom: 2px solid ${COLORS.border};
`

// Common input styles
export const InputsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${SPACING.xl}px;
  margin-top: ${SPACING.xxl}px;
`

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.md}px;

  label {
    font-size: ${TYPOGRAPHY.fontSize.sm};
    font-weight: ${TYPOGRAPHY.fontWeight.semibold};
    color: ${COLORS.textPrimary};
  }

  input {
    padding: ${INPUT_DIMENSIONS.padding.md};
    border: 1px solid ${COLORS.borderLight};
    border-radius: ${BORDER_RADIUS.sm}px;
    font-size: ${TYPOGRAPHY.fontSize.sm};

    &:focus {
      outline: none;
      border-color: ${COLORS.primary};
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
  }
`

// Common button styles
export const PrimaryButton = styled.button`
  background-color: ${COLORS.primary};
  color: white;
  border: none;
  border-radius: ${BORDER_RADIUS.sm}px;
  padding: ${INPUT_DIMENSIONS.padding.md};
  font-size: ${TYPOGRAPHY.fontSize.sm};
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${COLORS.hoverPrimary};
  }

  &:disabled {
    background-color: ${COLORS.textMuted};
    cursor: not-allowed;
  }
`

export const SecondaryButton = styled.button`
  background-color: ${COLORS.textMuted};
  color: white;
  border: none;
  border-radius: ${BORDER_RADIUS.sm}px;
  padding: ${INPUT_DIMENSIONS.padding.md};
  font-size: ${TYPOGRAPHY.fontSize.sm};
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${COLORS.textSecondary};
  }

  &:disabled {
    background-color: ${COLORS.textMuted};
    cursor: not-allowed;
  }
`

export const DangerButton = styled.button`
  background-color: ${COLORS.danger};
  color: white;
  border: none;
  border-radius: ${BORDER_RADIUS.sm}px;
  padding: ${COMPONENT_DIMENSIONS.button.padding};
  font-size: ${TYPOGRAPHY.fontSize.xs};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`

export const SmallButton = styled.button`
  background-color: ${COLORS.primary};
  color: white;
  border: none;
  border-radius: ${BORDER_RADIUS.sm}px;
  padding: ${COMPONENT_DIMENSIONS.button.padding};
  font-size: ${TYPOGRAPHY.fontSize.xs};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${COLORS.hoverPrimary};
  }
`

// Common list/grid styles
export const GridContainer = styled.div`
  display: grid;
  gap: ${SPACING.lg}px;
`

export const SelectableItem = styled.div<{ $selected?: boolean }>`
  padding: ${SPACING.lg}px;
  background: ${(props) => (props.$selected ? '#e8f4fd' : '#f8f9fa')};
  border-radius: ${BORDER_RADIUS.md}px;
  border: 1px solid ${(props) => (props.$selected ? COLORS.primary : COLORS.border)};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$selected ? '#d6eaf8' : COLORS.hoverLight)};
    border-color: ${COLORS.primary};
  }
`

export const EmptyStateContainer = styled.div`
  text-align: center;
  padding: ${SPACING.xxxl}px ${SPACING.xxl}px;
  color: ${COLORS.textSecondary};

  p {
    margin: 0;
    font-size: ${TYPOGRAPHY.fontSize.base};
  }
`

// Common header patterns
export const DimensionsHeader = styled.div`
  background: #e8f4fd;
  padding: ${SPACING.lg}px;
  border-radius: ${BORDER_RADIUS.md}px;
  margin-bottom: ${SPACING.xxl}px;
  text-align: center;

  .total-dimensions {
    font-weight: ${TYPOGRAPHY.fontWeight.semibold};
    color: ${COLORS.textPrimary};
    font-size: ${TYPOGRAPHY.fontSize.base};
  }

  .dimensions-label {
    font-size: ${TYPOGRAPHY.fontSize.xs};
    color: ${COLORS.textSecondary};
    margin-top: ${SPACING.xs}px;
  }
`

export const ToggleGroup = styled.div`
  margin-bottom: ${SPACING.xxl}px;

  label {
    display: flex;
    align-items: center;
    font-weight: ${TYPOGRAPHY.fontWeight.semibold};
    color: ${COLORS.textPrimary};
    font-size: ${TYPOGRAPHY.fontSize.sm};
    cursor: pointer;

    input {
      margin-right: ${SPACING.md}px;
    }
  }
`

// Common text styles
export const InfoText = styled.div`
  font-size: ${TYPOGRAPHY.fontSize.sm};
  color: ${COLORS.textPrimary};
  text-align: center;
`

export const DetailText = styled.div`
  font-size: ${TYPOGRAPHY.fontSize.xs};
  color: ${COLORS.textSecondary};
`

export const LabelText = styled.div`
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
  color: ${COLORS.textPrimary};
  margin-bottom: ${SPACING.xs}px;
`
