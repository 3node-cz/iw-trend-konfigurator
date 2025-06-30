import { useCallback, useRef } from 'react'

/**
 * Hook for debouncing function calls
 * Useful for input handlers to reduce excessive API calls or heavy computations
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    }) as T,
    [callback, delay],
  )
}

/**
 * Hook for throttling function calls
 * Ensures function is called at most once per specified interval
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useThrottle = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): T => {
  const lastCallRef = useRef<number>(0)

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now
        callback(...args)
      }
    }) as T,
    [callback, delay],
  )
}
