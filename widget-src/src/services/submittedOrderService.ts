import { updateCustomerMetafield, getCustomerMetafield } from './customerMetafieldService'

const SUBMITTED_ORDERS_NAMESPACE = 'custom'
const SUBMITTED_ORDERS_KEY = 'submitted_orders'

export interface SubmittedOrderReference {
  id: string // Our internal ID for tracking
  draftOrderId: string // Shopify Draft Order ID (gid://shopify/DraftOrder/123)
  orderId: string | null // Shopify Order ID after conversion (gid://shopify/Order/123)
  orderName: string // Display name like "#D123" or "#1234"
  submittedAt: string // ISO timestamp
  status: 'draft' | 'pending' | 'paid' | 'fulfilled' | 'cancelled'
  totalPieces: number
  totalBoards: number
  materialNames: string[]
}

export interface SubmittedOrderService {
  saveOrderReference: (reference: SubmittedOrderReference) => Promise<{ success: boolean; error?: string }>
  getSubmittedOrders: () => Promise<SubmittedOrderReference[]>
  updateOrderStatus: (draftOrderId: string, status: SubmittedOrderReference['status']) => Promise<{ success: boolean; error?: string }>
}

/**
 * Service for tracking orders that have been submitted to Shopify
 * Stores references to Shopify draft orders/orders for status tracking
 */
export const createSubmittedOrderService = (): SubmittedOrderService => {
  const saveOrderReference = async (reference: SubmittedOrderReference): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('💾 Saving submitted order reference:', reference.draftOrderId)

      // Get existing references
      const existing = await getSubmittedOrders()

      // Check if reference already exists
      const existingIndex = existing.findIndex(r => r.draftOrderId === reference.draftOrderId)

      if (existingIndex >= 0) {
        existing[existingIndex] = reference
        console.log('📝 Updated existing order reference')
      } else {
        existing.push(reference)
        console.log('✨ Created new order reference')
      }

      // Save back to metafield
      const result = await updateCustomerMetafield(
        SUBMITTED_ORDERS_NAMESPACE,
        SUBMITTED_ORDERS_KEY,
        JSON.stringify(existing),
        'json'
      )

      if (result.success) {
        console.log('✅ Order reference saved successfully')
      }

      return result
    } catch (error) {
      console.error('❌ Error saving order reference:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  const getSubmittedOrders = async (): Promise<SubmittedOrderReference[]> => {
    try {
      const metafieldValue = await getCustomerMetafield(SUBMITTED_ORDERS_NAMESPACE, SUBMITTED_ORDERS_KEY)

      if (!metafieldValue) {
        console.log('📋 No submitted orders found')
        return []
      }

      const orders = JSON.parse(metafieldValue) as SubmittedOrderReference[]

      console.log(`📋 Loaded ${orders.length} submitted orders`)
      return orders
    } catch (error) {
      console.error('❌ Error loading submitted orders:', error)
      return []
    }
  }

  const updateOrderStatus = async (
    draftOrderId: string,
    status: SubmittedOrderReference['status']
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔄 Updating order status:', draftOrderId, status)

      const existing = await getSubmittedOrders()
      const order = existing.find(r => r.draftOrderId === draftOrderId)

      if (!order) {
        console.warn('⚠️ Order reference not found:', draftOrderId)
        return { success: false, error: 'Order reference not found' }
      }

      order.status = status

      const result = await updateCustomerMetafield(
        SUBMITTED_ORDERS_NAMESPACE,
        SUBMITTED_ORDERS_KEY,
        JSON.stringify(existing),
        'json'
      )

      if (result.success) {
        console.log('✅ Order status updated successfully')
      }

      return result
    } catch (error) {
      console.error('❌ Error updating order status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  return {
    saveOrderReference,
    getSubmittedOrders,
    updateOrderStatus
  }
}
