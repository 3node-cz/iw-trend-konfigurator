import { useEffect, useRef, useCallback } from 'react'
import { createDraftOrderService } from '../services/draftOrderService'
import { createSavedOrder } from '../types/savedOrder'
import { useCustomer } from './useCustomer'
import type { OrderFormData, CuttingSpecification } from '../types/shopify'
import type { CuttingLayoutData } from './useCuttingLayouts'
import type { OrderCalculations } from './useOrderCalculations'

interface UseAutoSaveDraftOptions {
  orderData: OrderFormData | null
  specifications: CuttingSpecification[]
  cuttingLayouts?: CuttingLayoutData[]
  orderCalculations?: OrderCalculations
  currentStep?: 'material-selection' | 'cutting-specification' | 'order-form' | 'recapitulation'
  enabled?: boolean
  debounceMs?: number
}

/**
 * Hook for auto-saving order drafts
 * Automatically saves the order as a draft when user is working on it
 */
export const useAutoSaveDraft = ({
  orderData,
  specifications,
  cuttingLayouts = [],
  orderCalculations,
  currentStep,
  enabled = true,
  debounceMs = 2000 // Default 2 seconds debounce
}: UseAutoSaveDraftOptions) => {
  const { customer } = useCustomer()
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const lastSaveRef = useRef<string>('')

  const saveDraft = useCallback(async () => {
    if (!enabled || !customer || !orderData) {
      return
    }

    // Don't save if there are no specifications yet
    if (specifications.length === 0) {
      return
    }

    try {
      const draftService = createDraftOrderService()

      // Create draft order with current state
      const draftOrder = createSavedOrder(
        orderData,
        specifications,
        cuttingLayouts,
        orderCalculations
      )

      // Set status to draft and save current step
      draftOrder.status = 'draft'
      draftOrder.savedFromStep = currentStep || 'cutting-specification'

      // Check if anything actually changed (avoid unnecessary saves)
      const currentState = JSON.stringify({
        order: orderData,
        specs: specifications,
        step: currentStep
      })

      if (currentState === lastSaveRef.current) {
        return
      }

      await draftService.saveDraftOrder(draftOrder)
      lastSaveRef.current = currentState
    } catch (error) {
      console.error('❌ Failed to auto-save draft order:', error)
      // Don't show error to user - auto-save is background operation
    }
  }, [enabled, customer, orderData, specifications, cuttingLayouts, orderCalculations, currentStep])

  // Debounced auto-save effect
  useEffect(() => {
    if (!enabled || !customer) {
      return
    }

    // Clear any pending save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Schedule new save
    timeoutRef.current = setTimeout(() => {
      saveDraft()
    }, debounceMs)

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [saveDraft, debounceMs, enabled, customer])

  // Return manual save function in case it's needed
  return {
    saveDraft
  }
}
