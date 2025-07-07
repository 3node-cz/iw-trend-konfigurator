import React, { useMemo } from 'react'
import type { SheetLayout, CornerModification } from '../../types/simple'
import {
  generateBasicPartsKey,
  generateVisualKey,
  generateEnhancedPartsKey,
} from '../../utils/keyGeneration'

interface BasicPart {
  id: string
  width: number
  height: number
  quantity: number
}

interface VisualEnhancements {
  corners?: {
    topLeft: CornerModification
    topRight: CornerModification
    bottomRight: CornerModification
    bottomLeft: CornerModification
  }
  edges?: Record<string, string>
  lShape?: { enabled: boolean; leftWidth?: number; topHeight?: number }
}

type EnhancedPart = BasicPart & VisualEnhancements

// HOC for components that only need basic part data (dimensions, quantity)
// Re-renders only when basic part dimensions change
export function withBasicPartsOptimization<
  T extends { basicParts: BasicPart[] },
>(Component: React.ComponentType<T>) {
  return React.memo((props: T) => {
    const basicPartsKey = useMemo(() => {
      return generateBasicPartsKey(props.basicParts)
    }, [props.basicParts])

    return (
      <Component
        key={basicPartsKey}
        {...props}
      />
    )
  })
}

// HOC for components that only need layout data (sheet visualization)
// Re-renders only when layout calculation changes
export function withLayoutOptimization<
  T extends { sheetLayout: SheetLayout | null },
>(Component: React.ComponentType<T>) {
  return React.memo((props: T) => {
    const layoutKey = useMemo(() => {
      if (!props.sheetLayout) return 'no-layout'
      return `${props.sheetLayout.totalSheets}-${props.sheetLayout.overallEfficiency}`
    }, [props.sheetLayout])

    return (
      <Component
        key={layoutKey}
        {...props}
      />
    )
  })
}

// HOC for components that only need visual enhancements (part editors)
// Re-renders only when visual properties change
export function withVisualOptimization<
  T extends {
    selectedPartId?: string
    visualEnhancements: Record<string, VisualEnhancements>
  },
>(Component: React.ComponentType<T>) {
  return React.memo((props: T) => {
    const visualKey = useMemo(() => {
      return generateVisualKey(props.selectedPartId, props.visualEnhancements)
    }, [props.selectedPartId, props.visualEnhancements])

    return (
      <Component
        key={visualKey}
        {...props}
      />
    )
  })
}

// HOC for components that need the full enhanced parts list
// Re-renders when basic parts OR visual enhancements change
export function withEnhancedPartsOptimization<
  T extends { enhancedParts: EnhancedPart[] },
>(Component: React.ComponentType<T>) {
  return React.memo((props: T) => {
    const enhancedPartsKey = useMemo(() => {
      return generateEnhancedPartsKey(props.enhancedParts)
    }, [props.enhancedParts])

    return (
      <Component
        key={enhancedPartsKey}
        {...props}
      />
    )
  })
}
