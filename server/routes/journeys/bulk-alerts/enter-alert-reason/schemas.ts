import z from 'zod'
import { createSchema } from '../../../../middleware/validationMiddleware'

const ERROR_MSG = 'You must enter why you are creating this alert'
const TOO_LONG_ERROR_MSG = 'Reason why you are creating this alert must be 4,000 characters or less'

export const schema = createSchema({
  description: z
    .string({ message: ERROR_MSG })
    .max(4000, TOO_LONG_ERROR_MSG)
    .refine(val => val && val.trim().length > 0, ERROR_MSG),
})

export type SchemaType = z.infer<typeof schema>
