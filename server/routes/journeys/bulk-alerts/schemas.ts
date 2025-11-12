import { Request } from 'express'
import { z } from 'zod/v3'
import { createSchema, validateAndTransformReferenceData } from '../../../middleware/validationMiddleware'
import AlertsApiClient from '../../../data/alertsApiClient'

export const schemaFactory = (alertsApiClient: AlertsApiClient) => async (req: Request) => {
  const types = await alertsApiClient.retrieveAlertTypes(req.middleware.clientToken, true)

  const alertTypeMap = new Map(
    types.map(type => {
      const { alertCodes, ...rest } = type
      return [type.code, rest]
    }),
  )

  const alertCodeMap = new Map(types.flatMap(type => type.alertCodes).map(code => [code.code, code]))

  return createSchema({
    alertType: z.string().transform(validateAndTransformReferenceData(alertTypeMap, 'You must select an alert type')),
    alertCode: z.string().transform(validateAndTransformReferenceData(alertCodeMap, 'You must select an alert')),
  })
}

export type SchemaType = z.infer<Awaited<ReturnType<ReturnType<typeof schemaFactory>>>>
