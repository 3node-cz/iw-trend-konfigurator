import styled from 'styled-components'

export const PartCanvas = styled.div<{ $aspectRatio: number }>`
  width: 100%;
  max-width: 500px;
  height: ${(props) => 500 / props.$aspectRatio}px;
  max-height: 400px;
  margin: 0 auto 20px;
  background: #f8f9fa;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

export const PartSvg = styled.svg`
  max-width: 100%;
  max-height: 100%;
  overflow: visible;
`

export const DimensionLabel = styled.div<{ $position: 'width' | 'height' }>`
  position: absolute;
  font-size: 0.8rem;
  font-weight: 600;
  color: #2c3e50;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid #e1e8ed;

  ${(props) =>
    props.$position === 'width'
      ? `
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
  `
      : `
    right: -15px;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
    transform-origin: center;
  `}
`

export const PreviewLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: #7f8c8d;
  }

  .legend-box {
    width: 16px;
    height: 3px;
    border-radius: 1px;

    &.dashed {
      border: 1px dashed #bdc3c7;
      background: transparent;
    }

    &.solid {
      background: #3498db;
    }
  }

  .legend-circle {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &.corner {
      background: #e74c3c;
    }
  }
`

export const HintText = styled.div`
  font-size: 0.75rem;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 16px;
`
