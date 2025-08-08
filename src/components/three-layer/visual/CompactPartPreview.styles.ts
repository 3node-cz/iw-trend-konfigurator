/**
 * Styled components for CompactPartPreview
 */
import styled from 'styled-components'

export const CompactPreviewContainer = styled.div<{ 
  $width: number
  $height: number 
}>`
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
`

export const CompactSvg = styled.svg`
  width: 100%;
  height: 100%;
  display: block;
`

export const FramePreviewContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

export const FramePiece = styled.div<{
  $x: number
  $y: number
  $width: number
  $height: number
  $color: string
}>`
  position: absolute;
  left: ${props => props.$x}px;
  top: ${props => props.$y}px;
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  background: ${props => props.$color};
  opacity: 0.9;
`
