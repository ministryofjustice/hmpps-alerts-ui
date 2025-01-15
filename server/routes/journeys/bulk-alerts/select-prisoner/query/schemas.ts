import { z } from 'zod'
import { createSchema } from '../../../../../middleware/validationMiddleware'

const ERROR_MSG = 'You must enter a name or prison number in the format A1234CD'

export const schema = createSchema({
  query: z.string({ message: ERROR_MSG }).refine(val => val && val.trim().length > 0, ERROR_MSG),
})

export type SchemaType = z.infer<typeof schema>
