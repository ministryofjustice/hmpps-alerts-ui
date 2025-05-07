import { z } from 'zod'
import { createSchema } from '../../../../middleware/validationMiddleware'

const ERROR_MSG = 'Select the change you want to make'

export const schema = createSchema({
  changeType: z.enum(['ADD_NEW', 'EDIT_DESCRIPTION', 'DEACTIVATE', 'REACTIVATE'], { message: ERROR_MSG }),
})

export type SchemaType = z.infer<typeof schema>
