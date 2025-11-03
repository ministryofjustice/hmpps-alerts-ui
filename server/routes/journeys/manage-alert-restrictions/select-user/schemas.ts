import { z } from 'zod'
import { Request } from 'express'
import { createSchema } from '../../../../middleware/validationMiddleware'

const ERROR_MSG = 'Enter a username'

export const schemaFactory = () => async (_req: Request) => {
  return createSchema({
    username: z.string({ message: ERROR_MSG }).min(1, 'Enter a username'),
  })
}

export type SchemaType = z.infer<Awaited<ReturnType<ReturnType<typeof schemaFactory>>>>
