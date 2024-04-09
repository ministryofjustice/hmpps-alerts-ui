import RestClient from './restClient'
import config from '../config'
import logger from '../../logger'
import { AlertType, CreateAlertTypeRequest } from '../@types/alerts/alertsApiTypes'

export default class AlertsApiClient {
  constructor() {}

  private static restClient(token: string): RestClient {
    return new RestClient('Alerts Api Client', config.apis.alertsApi, token)
  }

  createAlertType(token: string, requestBody: CreateAlertTypeRequest) {
    logger.info(`Creating an alert with body ${JSON.stringify(requestBody)}`)
    return AlertsApiClient.restClient(token).post({ path: '/alert-types', data: requestBody })
  }

  retrieveAlertTypes(token: string): Promise<AlertType[]> {
    logger.info('Retrieving all alert types')
    return AlertsApiClient.restClient(token).get({ path: '/alert-types' })
  }
}