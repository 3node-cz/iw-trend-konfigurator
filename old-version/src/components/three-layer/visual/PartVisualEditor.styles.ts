import styled from 'styled-components'

export const EditorContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
  margin-bottom: 20px;
`

export const EditorTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.3rem;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #7f8c8d;

  p {
    margin: 0;
    font-size: 1rem;
  }
`

export const PartHeader = styled.div`
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
