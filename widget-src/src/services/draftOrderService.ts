import type { SavedOrder } from '../types/savedOrder'
import { updateCustomerMetafield, getCustomerMetafield } from './customerMetafieldService'

const DRAFT_ORDERS_NAMESPACE = 'custom'
const DRAFT_ORDERS_KEY = 'draft_orders'

export interface DraftOrderService {
  saveDraftOrder: (order: SavedOrder) => Promise<{ success: boolean; error?: string }>
  getDraftOrders: () => Promise<SavedOrder[]>
  deleteDraftOrder: (orderId: string) => Promise<{ success: boolean; error?: string }>
  updateDraftOrder: (order: SavedOrder) => Promise<{ success: boolean; error?: string }>
}

/**
 * Service for managing draft orders (auto-saved before submission)
 * Drafts are stored in customer metafield and can be deleted without affecting Shopify orders
 */
export const createDraftOrderService = (): DraftOrderService => {
  const saveDraftOrder = async (order: SavedOrder): Promise<{ success: boolean; error?: string }> => {
    try {
      // Get existing drafts
      const existingDrafts = await getDraftOrders()

      // Check if draft already exists (update it)
      const existingIndex = existingDrafts.findIndex(d => d.id === order.id)

      if (existingIndex >= 0) {
        existingDrafts[existingIndex] = {
          ...order,
          updatedAt: new Date()
        }
      } else {
        existingDrafts.push(order)
      }

      // Save back to metafield
      const result = await updateCustomerMetafield(
        DRAFT_ORDERS_NAMESPACE,
        DRAFT_ORDERS_KEY,
        JSON.stringify(existingDrafts),
        'json'
      )

      return result
    } catch (error) {
      console.error('❌ Error saving draft order:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  const getDraftOrders = async (): Promise<SavedOrder[]> => {
    try {
      const metafieldValue = await getCustomerMetafield(DRAFT_ORDERS_NAMESPACE, DRAFT_ORDERS_KEY)

      if (!metafieldValue) {
        return []
      }

      console.log('🧪 [DRAFT-ORDERS] Raw metafield value:', metafieldValue)
      console.log('🧪 [DRAFT-ORDERS] Value type:', typeof metafieldValue)
      console.log('🧪 [DRAFT-ORDERS] First 100 chars:', typeof metafieldValue === 'string' ? metafieldValue.substring(0, 100) : JSON.stringify(metafieldValue).substring(0, 100))

      // If the value is already an object (already parsed), use it directly
      let drafts: SavedOrder[]
      if (typeof metafieldValue === 'string') {
        drafts = JSON.parse(metafieldValue) as SavedOrder[]
      } else {
        // Already parsed (happens when reading from window.ConfiguratorConfig cache)
        drafts = metafieldValue as SavedOrder[]
      }

      // Convert date strings back to Date objects
      const parsedDrafts = drafts.map(draft => ({
        ...draft,
        createdAt: new Date(draft.createdAt),
        updatedAt: new Date(draft.updatedAt)
      }))

      return parsedDrafts
    } catch (error) {
      console.error('❌ Error loading draft orders:', error)
      return []
    }
  }

  const deleteDraftOrder = async (orderId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const existingDrafts = await getDraftOrders()
      const filteredDrafts = existingDrafts.filter(d => d.id !== orderId)

      if (filteredDrafts.length === existingDrafts.length) {
        console.warn('⚠️ Draft order not found:', orderId)
        return { success: false, error: 'Draft order not found' }
      }

      const result = await updateCustomerMetafield(
        DRAFT_ORDERS_NAMESPACE,
        DRAFT_ORDERS_KEY,
        JSON.stringify(filteredDrafts),
        'json'
      )

      return result
    } catch (error) {
      console.error('❌ Error deleting draft order:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  const updateDraftOrder = async (order: SavedOrder): Promise<{ success: boolean; error?: string }> => {
    // Same as saveDraftOrder - it handles both create and update
    return saveDraftOrder(order)
  }

  return {
    saveDraftOrder,
    getDraftOrders,
    deleteDraftOrder,
    updateDraftOrder
  }
}
