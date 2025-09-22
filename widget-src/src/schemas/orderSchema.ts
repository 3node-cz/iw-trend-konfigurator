import { z } from 'zod'
import type { CustomerOrderData } from '../services/customerApi'

const REQUIRED_FIELD_MESSAGE = 'Toto pole je povinné'
const MIN_LENGTH_MESSAGE = 'Minimálne 2 znaky'

export const orderSchema = z.object({
  // Essential order information
  orderName: z.string()
    .min(1, REQUIRED_FIELD_MESSAGE)
    .min(2, MIN_LENGTH_MESSAGE),
  
  deliveryDate: z.date().nullable().refine(date => date !== null, {
    message: REQUIRED_FIELD_MESSAGE
  }),
  
  // Location and logistics
  transferLocation: z.string()
    .min(1, REQUIRED_FIELD_MESSAGE),
  
  costCenter: z.string()
    .min(1, REQUIRED_FIELD_MESSAGE),
  
  cuttingCenter: z.string()
    .min(1, REQUIRED_FIELD_MESSAGE),
  
  deliveryMethod: z.string()
    .min(1, REQUIRED_FIELD_MESSAGE),
  
  processingType: z.string()
    .min(1, REQUIRED_FIELD_MESSAGE),
  
  // Optional fields
  notes: z.string().optional().default(''),
  discountPercentage: z.number()
    .min(0, 'Zľava nemôže byť záporná')
    .max(100, 'Zľava nemôže byť vyššia ako 100%')
    .default(0),
  
  // Company is always the same, make it optional with default
  company: z.string().default('IW TREND, s.r.o')
})

// Infer TypeScript type from schema
export type OrderFormData = z.infer<typeof orderSchema>

// Helper function to get field errors from ZodError
export const getFieldErrors = (error: z.ZodError): Record<string, string> => {
  const fieldErrors: Record<string, string> = {}
  
  error.issues.forEach((err: any) => {
    if (err.path.length > 0) {
      const fieldName = err.path[0] as string
      if (!fieldErrors[fieldName]) {
        fieldErrors[fieldName] = err.message
      }
    }
  })
  
  return fieldErrors
}

// Helper function to create order data with customer defaults
export const createOrderWithCustomerDefaults = (customer: CustomerOrderData | null): Partial<OrderFormData> => {
  if (!customer) {
    return {
      company: 'IW TREND, s.r.o',
      discountPercentage: 0
    }
  }

  return {
    company: customer.defaultCompany || 'IW TREND, s.r.o',
    transferLocation: customer.defaultTransferLocation,
    costCenter: customer.defaultCostCenter,
    cuttingCenter: customer.defaultCuttingCenter,
    deliveryMethod: customer.defaultDeliveryMethod,
    processingType: customer.defaultProcessingType,
    discountPercentage: customer.discountPercentage || 0
  }
}