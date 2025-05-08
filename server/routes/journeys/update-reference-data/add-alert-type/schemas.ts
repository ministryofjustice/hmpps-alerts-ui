import { z } from 'zod'
import { Request } from 'express'
import { createSchema } from '../../../../middleware/validationMiddleware'
import AlertsApiClient from '../../../../data/alertsApiClient'

const CODE_ERROR_MSG = 'An alert type code must be an uppercase series of letters between 1-12 characters long'
const DESCRIPTION_ERROR_MSG = 'An alert type description must be between 1 and 40 characters'

export const schemaFactory = (alertsApiClient: AlertsApiClient) => async (req: Request) => {
  const types = await alertsApiClient.retrieveAlertTypes(req.middleware.clientToken, true)
  const alertTypes = types.map(type => type.code)

  return createSchema({
    code: z
      .string({ message: CODE_ERROR_MSG })
      .regex(/^[A-Z]{1,12}$/, CODE_ERROR_MSG)
      .refine(val => !alertTypes.includes(val), `Alert type code ‘${req.body.code}’ already exists`),
    description: z
      .string({ message: DESCRIPTION_ERROR_MSG })
      .min(1, DESCRIPTION_ERROR_MSG)
      .max(40, DESCRIPTION_ERROR_MSG),
  })
}

export type SchemaType = z.infer<Awaited<ReturnType<ReturnType<typeof schemaFactory>>>>
