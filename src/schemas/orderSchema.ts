import { z } from 'zod'

const REQUIRED_FIELD_MESSAGE = 'Toto pole je povinné'
const MIN_LENGTH_MESSAGE = 'Minimálne 2 znaky'
const INVALID_DATE_MESSAGE = 'Neplatný dátum'

export const orderSchema = z.object({
  company: z.string()
    .min(1, REQUIRED_FIELD_MESSAGE)
    .min(2, MIN_LENGTH_MESSAGE),
  
  transferLocation: z.string()
    .min(1, REQUIRED_FIELD_MESSAGE),
  
  costCenter: z.string()
    .min(1, REQUIRED_FIELD_MESSAGE),
  
  cuttingCenter: z.string()
    .min(1, REQUIRED_FIELD_MESSAGE),
  
  orderName: z.string()
    .min(1, REQUIRED_FIELD_MESSAGE)
    .min(2, MIN_LENGTH_MESSAGE),
  
  deliveryDate: z.date({
    errorMap: () => ({ message: REQUIRED_FIELD_MESSAGE })
  }).nullable().refine(date => date !== null, {
    message: REQUIRED_FIELD_MESSAGE
  }),
  
  materialType: z.string()
    .min(1, REQUIRED_FIELD_MESSAGE),
  
  deliveryMethod: z.string()
    .min(1, REQUIRED_FIELD_MESSAGE),
  
  processingType: z.string()
    .min(1, REQUIRED_FIELD_MESSAGE),
  
  // Optional fields
  withoutEdges: z.boolean().default(false),
  bandingFree: z.boolean().default(false),
  palettePayment: z.boolean().default(false),
  notes: z.string().optional().default('')
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