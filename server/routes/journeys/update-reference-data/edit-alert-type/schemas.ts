import { z } from 'zod'
import { createSchema } from '../../../../middleware/validationMiddleware'

const DESCRIPTION_ERROR_MSG = 'An alert type description must be between 1 and 40 characters'

export const schema = createSchema({
  description: z.string({ error: DESCRIPTION_ERROR_MSG }).min(1, DESCRIPTION_ERROR_MSG).max(40, DESCRIPTION_ERROR_MSG),
})

export type SchemaType = z.infer<typeof schema>
