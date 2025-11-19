import { Request } from 'express'
import { z } from 'zod'
import { UUID } from 'node:crypto'
import { createSchema } from '../../middleware/validationMiddleware'
import AlertsApiClient from '../../data/alertsApiClient'

export const schemaFactory = (alertsApiClient: AlertsApiClient) => async (req: Request) => {
  return createSchema({
    alertUuid: z
      .uuid('Enter a valid alert UUID')
      .transform(val => val as unknown as UUID)
      .refine(
        val =>
          alertsApiClient
            .getAlert(req.middleware.clientToken, val)
            .then(() => true)
            .catch(() => false),
        { error: 'Unable to find existing alert' },
      ),
  })
}

export type SchemaType = z.infer<Awaited<ReturnType<ReturnType<typeof schemaFactory>>>>
