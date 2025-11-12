import { Request } from 'express'
import { z, RefinementCtx } from 'zod/v3'
import { UUID } from 'node:crypto'
import { createSchema } from '../../middleware/validationMiddleware'
import AlertsApiClient from '../../data/alertsApiClient'

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

export const schemaFactory = (alertsApiClient: AlertsApiClient) => async (req: Request) => {
  return createSchema({
    alertUuid: z
      .string()
      .uuid('Enter a valid alert UUID')
      .transform((val: string, _: RefinementCtx) => val as unknown as UUID),
  }).superRefine(async (val, ctx) => {
    const id = val.alertUuid
    if (id && uuidRegex.test(id.toLowerCase())) {
      try {
        await alertsApiClient.getAlert(req.middleware.clientToken, id)
      } catch {
        ctx.addIssue({
          code: 'custom',
          message: `Unable to find existing alert`,
          path: ['alertUuid'],
        })
      }
    }
  })
}

export type SchemaType = z.infer<Awaited<ReturnType<ReturnType<typeof schemaFactory>>>>
