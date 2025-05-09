import { z } from 'zod'
import { createSchema } from '../../../../middleware/validationMiddleware'

const ERROR_MSG = 'Select whether you want to deactivate the alert'

export const schema = createSchema({
  confirm: z.enum(['YES', 'NO'], { message: ERROR_MSG }),
})

export type SchemaType = z.infer<typeof schema>
