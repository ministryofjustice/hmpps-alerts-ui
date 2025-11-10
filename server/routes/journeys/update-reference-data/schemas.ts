import { z } from 'zod/v3'
import { createSchema } from '../../../middleware/validationMiddleware'

const ERROR_MSG = 'Select the type of reference data you want to update'

export const schema = createSchema({
  referenceDataType: z.enum(['ALERT_CODE', 'ALERT_TYPE'], { message: ERROR_MSG }),
})

export type SchemaType = z.infer<typeof schema>
