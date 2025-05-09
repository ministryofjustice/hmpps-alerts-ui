import { Request } from 'express'
import { z } from 'zod'
import AlertsApiClient from '../../../../data/alertsApiClient'
import { createSchema, validateAndTransformReferenceData } from '../../../../middleware/validationMiddleware'
import { getAlertTypeFilter } from './utils'

const ERROR_MSG = 'You must select an alert type'

export const schemaFactory = (alertsApiClient: AlertsApiClient) => async (req: Request) => {
  const alertTypeMap = new Map(
    (await alertsApiClient.retrieveAlertTypes(req.middleware.clientToken, true))
      .filter(getAlertTypeFilter(req.journeyData.updateRefData!))
      .map(type => {
        const { alertCodes, ...rest } = type
        return [type.code, rest]
      }),
  )

  return createSchema({
    alertType: z.string({ message: ERROR_MSG }).transform(validateAndTransformReferenceData(alertTypeMap, ERROR_MSG)),
  })
}

export type SchemaType = z.infer<Awaited<ReturnType<ReturnType<typeof schemaFactory>>>>
