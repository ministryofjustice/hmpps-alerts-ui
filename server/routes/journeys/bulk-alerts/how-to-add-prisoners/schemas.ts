import { z } from 'zod'
import { createSchema, validateAndTransformReferenceData } from '../../../../middleware/validationMiddleware'

const ERROR_MSG = 'You must select one option'

const BOOLEAN_MAP = new Map([
  ['true', true],
  ['false', false],
])

export const schema = createSchema({
  useCsvUpload: z.string({ message: ERROR_MSG }).transform(validateAndTransformReferenceData(BOOLEAN_MAP, ERROR_MSG)),
})

export type SchemaType = z.infer<typeof schema>
