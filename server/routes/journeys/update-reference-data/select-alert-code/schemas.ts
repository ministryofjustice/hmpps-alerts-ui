import { Request } from 'express'
import { z } from 'zod'
import AlertsApiClient from '../../../../data/alertsApiClient'
import { createSchema, validateAndTransformReferenceData } from '../../../../middleware/validationMiddleware'
import { getAlertCodeFilter } from './utils'

const ERROR_MSG = 'You must select an alert'

export const schemaFactory = (alertsApiClient: AlertsApiClient) => async (req: Request) => {
  const alertCodeMap = new Map(
    (await alertsApiClient.retrieveAlertTypes(req.middleware.clientToken, true))
      .find(
        type =>
          type.code ===
          (req.journeyData.updateRefData?.updateAlertCodeSubJourney?.alertType?.code ??
            req.journeyData.updateRefData?.alertType?.code),
      )!
      .alertCodes.filter(getAlertCodeFilter(req.journeyData.updateRefData!))
      .map(code => [code.code, code]),
  )

  return createSchema({
    alertCode: z.string({ message: ERROR_MSG }).transform(validateAndTransformReferenceData(alertCodeMap, ERROR_MSG)),
  })
}

export type SchemaType = z.infer<Awaited<ReturnType<ReturnType<typeof schemaFactory>>>>
