import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'

const ERROR_MSG = 'Select the type of reference data you want to update'

export const schema = createSchema({
  referenceDataType: z.enum(['ALERT_CODE', 'ALERT_TYPE'], { error: ERROR_MSG }),
})

export type SchemaType = z.infer<typeof schema>
