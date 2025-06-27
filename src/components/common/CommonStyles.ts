import styled from 'styled-components'

// Common container styles
export const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
  margin-bottom: 20px;
`

export const CardTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.3rem;
`

export const SectionHeader = styled.h3`
  color: #2c3e50;
  font-size: 1.1rem;
  margin: 20px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e1e8ed;
`

// Common input styles
export const InputsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
`

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #2c3e50;
  }

  input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
  }
`

// Common button styles
export const PrimaryButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
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
`

export const SecondaryButton = styled.button`
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #7f8c8d;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`

export const DangerButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`

export const SmallButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`

// Common list/grid styles
export const GridContainer = styled.div`
  display: grid;
  gap: 12px;
`

export const SelectableItem = styled.div<{ $selected?: boolean }>`
  padding: 12px;
  background: ${(props) => (props.$selected ? '#e8f4fd' : '#f8f9fa')};
  border-radius: 6px;
  border: 1px solid ${(props) => (props.$selected ? '#3498db' : '#e1e8ed')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$selected ? '#d6eaf8' : '#ecf0f1')};
    border-color: #3498db;
  }
`

export const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #7f8c8d;

  p {
    margin: 0;
    font-size: 1rem;
  }
`

// Common header patterns
export const DimensionsHeader = styled.div`
  background: #e8f4fd;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;

  .total-dimensions {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1rem;
  }

  .dimensions-label {
    font-size: 0.8rem;
    color: #7f8c8d;
    margin-top: 2px;
  }
`

export const ToggleGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
    cursor: pointer;

    input {
      margin-right: 8px;
    }
  }
`

// Common text styles
export const InfoText = styled.div`
  font-size: 0.9rem;
  color: #2c3e50;
  text-align: center;
`

export const DetailText = styled.div`
  font-size: 0.8rem;
  color: #7f8c8d;
`

export const LabelText = styled.div`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2px;
`
