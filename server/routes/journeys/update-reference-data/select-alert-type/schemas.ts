import { Request } from 'express'
import { z } from 'zod'
import AlertsApiClient from '../../../../data/alertsApiClient'
import { createSchema, validateAndTransformReferenceData } from '../../../../middleware/validationMiddleware'
import { AlertType } from '../../../../@types/alerts/alertsApiTypes'

const ERROR_MSG = 'You must select an alert type'

export const schemaFactory = (alertsApiClient: AlertsApiClient) => async (req: Request) => {
  const types = await alertsApiClient.retrieveAlertTypes(req.middleware.clientToken, true)

  let typeFilter = (_type: AlertType) => true

  if (req.journeyData.updateRefData!.referenceDataType === 'ALERT_TYPE') {
    if (req.journeyData.updateRefData!.changeType === 'DEACTIVATE') {
      typeFilter = (type: AlertType) => type.isActive
    } else if (req.journeyData.updateRefData!.changeType === 'REACTIVATE') {
      typeFilter = (type: AlertType) => !type.isActive
    }
  }

  const alertTypeMap = new Map(
    types.filter(typeFilter).map(type => {
      const { alertCodes, ...rest } = type
      return [type.code, rest]
    }),
  )

  return createSchema({
    alertType: z.string({ message: ERROR_MSG }).transform(validateAndTransformReferenceData(alertTypeMap, ERROR_MSG)),
  })
}

export type SchemaType = z.infer<Awaited<ReturnType<ReturnType<typeof schemaFactory>>>>
