import { z } from 'zod'
import { createSchema } from '../../../../middleware/validationMiddleware'

const CODE_ERROR_MSG = 'An alert code must be an uppercase series of letters between 1-12 characters long'
const DESCRIPTION_ERROR_MSG = 'An alert description must be between 1 and 40 characters'

export const schema = createSchema({
  code: z.string({ message: CODE_ERROR_MSG }).regex(/^[A-Z]{1,12}$/, CODE_ERROR_MSG),
  description: z
    .string({ message: DESCRIPTION_ERROR_MSG })
    .min(1, DESCRIPTION_ERROR_MSG)
    .max(40, DESCRIPTION_ERROR_MSG),
})

export type SchemaType = z.infer<typeof schema>
