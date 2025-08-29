import { useMutation } from '@tanstack/react-query'
import type { OrderFormData, CuttingSpecification } from '../types/shopify'

interface CompleteOrder {
  order: OrderFormData
  specification: CuttingSpecification
  submittedAt: Date
}

interface OrderSubmissionResponse {
  orderId: string
  shopifyOrderId: string
  status: 'success' | 'error'
  message: string
}

// This should call your BACKEND API, not Shopify directly
const submitOrderToBackend = async (completeOrder: CompleteOrder): Promise<OrderSubmissionResponse> => {
  const response = await fetch('/api/orders/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add authentication headers if needed
      // 'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify(completeOrder)
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const useOrderSubmission = () => {
  return useMutation({
    mutationFn: submitOrderToBackend,
    onSuccess: (data) => {
      console.log('Order submitted successfully:', data)
    },
    onError: (error) => {
      console.error('Order submission failed:', error)
    }
  })
}