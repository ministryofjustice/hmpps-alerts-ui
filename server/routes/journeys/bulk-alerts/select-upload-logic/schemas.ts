import { z } from 'zod'
import { createSchema } from '../../../../middleware/validationMiddleware'
import { BulkAlertJourney } from '../../../../@types/express'

const ERROR_MSG = 'You must select one option'

export const schema = createSchema({
  cleanupMode: z
    .string({ message: ERROR_MSG })
    .refine(val => ['KEEP_ALL', 'EXPIRE_FOR_PRISON_NUMBERS_NOT_SPECIFIED'].includes(val), ERROR_MSG),
})

export type SchemaType = { cleanupMode: Exclude<BulkAlertJourney['cleanupMode'], undefined> }
