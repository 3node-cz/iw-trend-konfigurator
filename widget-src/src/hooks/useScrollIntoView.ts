import { useCallback, useEffect, useRef } from 'react'

interface ScrollIntoViewOptions {
  behavior?: 'auto' | 'smooth'
  block?: 'start' | 'center' | 'end' | 'nearest'
  inline?: 'start' | 'center' | 'end' | 'nearest'
  offset?: number // Additional offset from top
}

/**
 * Custom hook for scrolling the widget container into view
 * Uses native scrollIntoView API with smooth scrolling
 */
export const useScrollIntoView = (options: ScrollIntoViewOptions = {}) => {
  const {
    behavior = 'smooth',
    block = 'start',
    inline = 'nearest',
    offset = 20
  } = options

  const scrollToWidget = useCallback(() => {
    try {
      // Find the widget container - it's the root container with class 'universal-configurator'
      const widgetContainer = document.querySelector('.universal-configurator')

      if (widgetContainer) {
        // Scroll to widget with offset
        const elementTop = widgetContainer.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementTop - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: behavior
        })
      } else {
        // Fallback: try to find the React root container
        const reactRoot = document.querySelector('[class*="configurator-react-root"]')
        if (reactRoot) {
          reactRoot.scrollIntoView({
            behavior,
            block,
            inline
          })
        }
      }
    } catch (error) {
      console.warn('Could not scroll to widget:', error)
    }
  }, [behavior, block, inline, offset])

  // Auto-scroll on mount (useful for step changes)
  const scrollOnMount = useCallback((shouldScroll: boolean = true) => {
    if (shouldScroll) {
      // Small delay to ensure content is rendered
      setTimeout(scrollToWidget, 100)
    }
  }, [scrollToWidget])

  return {
    scrollToWidget,
    scrollOnMount
  }
}

/**
 * Hook for components that need to scroll into view when they mount
 * Useful for step changes in the configurator
 */
export const useScrollOnStepChange = (options: ScrollIntoViewOptions = {}) => {
  const { scrollOnMount } = useScrollIntoView(options)

  useEffect(() => {
    scrollOnMount(true)
  }, [scrollOnMount])

  return useScrollIntoView(options)
}