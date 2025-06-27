import styled from 'styled-components'

export const LShapeContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
  margin-bottom: 20px;
`

export const LShapeTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.3rem;
`

export const LShapeToggle = styled.div`
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

export const PreviewContainer = styled.div`
  background: #f8f9fa;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  min-height: 450px;
`

export const InputsContainer = styled.div`
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

export const SectionHeader = styled.h3`
  color: #2c3e50;
  font-size: 1.1rem;
  margin: 20px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e1e8ed;
`
