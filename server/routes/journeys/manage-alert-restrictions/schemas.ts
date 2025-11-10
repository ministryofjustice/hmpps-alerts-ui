import { z } from 'zod/v3'
import { createSchema } from '../../../middleware/validationMiddleware'

const ERROR_MSG = 'Select the change you want to make'

export const schema = createSchema({
  changeType: z.enum(['RESTRICT_ALERT', 'REMOVE_ALERT_RESTRICTION', 'ADD_PRIVILEGED_USER', 'REMOVE_PRIVILEGED_USER'], {
    message: ERROR_MSG,
  }),
})

export type SchemaType = z.infer<typeof schema>
