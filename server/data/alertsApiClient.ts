import RestClient from './restClient'
import config from '../config'
import logger from '../../logger'

export interface AlertType {
  code: string
  description: string
  listSequence: number
  isActive: boolean
  createdAt: string
  createdBy: string
  modifiedAt?: string
  modifiedBy?: string
  deactivatedAt?: string
  deactivatedBy?: string
  alertCodes: AlertCode[]
}

export interface AlertCode {
  alertTypeCode: string
  code: string
  description: string
  listSequence: number
  isActive: boolean
  createdAt: string
  createdBy: string
  modifiedAt?: string
  modifiedBy?: string
  deactivatedAt?: string
  deactivatedBy?: string
}

export interface CreateAlertTypeRequest extends Record<string, unknown> {
  code: string
  description: string
}

export default class AlertsApiClient {
  constructor() {}

  private static restClient(token: string): RestClient {
    return new RestClient('Alerts Api Client', config.apis.alertsApi, token)
  }

  createAlertType(token: string, requestBody: CreateAlertTypeRequest) {
    logger.info(`Creating an alert with body ${JSON.stringify(requestBody)}`)
    return AlertsApiClient.restClient(token).post({ path: '/alert-types', data: requestBody })
  }
}
