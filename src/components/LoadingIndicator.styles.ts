import styled, { keyframes } from 'styled-components'

// Keyframe animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const dots = keyframes`
  0%, 20% {
    color: rgba(0,0,0,0);
    text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0);
  }
  40% {
    color: #6c757d;
    text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0);
  }
  60% {
    text-shadow: .25em 0 0 #6c757d, .5em 0 0 rgba(0,0,0,0);
  }
  80%, 100% {
    text-shadow: .25em 0 0 #6c757d, .5em 0 0 #6c757d;
  }
`

// Spinner component
export const Spinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-right: 8px;
`

// Loading container variants
export const LoadingContainer = styled.div<{ $overlay?: boolean }>`
  ${(props) =>
    props.$overlay
      ? `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        border-radius: 4px;
      `
      : `
        display: flex;
        align-items: center;
        padding: 8px 16px;
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        color: #495057;
        font-size: 14px;
      `}
`

// Loading message
export const LoadingMessage = styled.span`
  font-size: 14px;
  color: #495057;
`

// Loading dots component
export const LoadingDotsContainer = styled.span`
  display: inline-block;
  font-size: 12px;
  color: #6c757d;
  margin-left: 8px;

  &:after {
    content: '...';
    animation: ${dots} 1.5s steps(4, end) infinite;
  }
`
