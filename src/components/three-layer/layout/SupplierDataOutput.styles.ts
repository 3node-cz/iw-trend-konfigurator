import styled from 'styled-components'

export const SupplierDataContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e1e8ed;
  margin-top: 20px;
`

export const SupplierDataTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
`

export const SupplierDataDescription = styled.p`
  margin: 0 0 16px 0;
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.4;
`

export const CopyButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 16px;
  transition: background-color 0.2s;

  &:hover {
    background: #2980b9;
  }

  &:active {
    background: #21618c;
  }
`

export const DataOutput = styled.pre`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.8rem;
  line-height: 1.4;
  color: #495057;
  max-height: 600px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
`
