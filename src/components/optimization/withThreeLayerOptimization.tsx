import React, { useMemo } from 'react'
import type { SheetLayout, CornerModification } from '../../types/simple'

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
      return props.basicParts
        .map(
          (part) => `${part.id}-${part.width}-${part.height}-${part.quantity}`,
        )
        .join('|')
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
      if (!props.selectedPartId) return 'no-selection'
      const enhancements = props.visualEnhancements[props.selectedPartId]
      if (!enhancements) return `${props.selectedPartId}-no-enhancements`

      const cornerKey = enhancements.corners
        ? Object.values(enhancements.corners)
            .map((c: CornerModification) => `${c.type}-${c.x || 0}-${c.y || 0}`)
            .join(',')
        : 'no-corners'
      const edgeKey = enhancements.edges
        ? Object.values(enhancements.edges).join(',')
        : 'no-edges'
      const lShapeKey = enhancements.lShape?.enabled
        ? `lshape-${enhancements.lShape.leftWidth || 0}-${
            enhancements.lShape.topHeight || 0
          }`
        : 'no-lshape'

      return `${props.selectedPartId}-${cornerKey}-${edgeKey}-${lShapeKey}`
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
      return props.enhancedParts
        .map((part) => {
          const basicKey = `${part.id}-${part.width}-${part.height}-${part.quantity}`
          const hasVisuals = part.corners || part.edges || part.lShape?.enabled
          return `${basicKey}-${hasVisuals ? 'visual' : 'basic'}`
        })
        .join('|')
    }, [props.enhancedParts])

    return (
      <Component
        key={enhancedPartsKey}
        {...props}
      />
    )
  })
}
