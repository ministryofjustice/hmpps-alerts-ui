import RestClient from './restClient'
import config from '../config'
import logger from '../../logger'
import { AlertType, CreateAlertCodeRequest, CreateAlertTypeRequest } from '../@types/alerts/alertsApiTypes'

export default class AlertsApiClient {
  constructor() {}

  private static restClient(token: string): RestClient {
    return new RestClient('Alerts Api Client', config.apis.alertsApi, token)
  }

  createAlertType(token: string, requestBody: CreateAlertTypeRequest) {
    logger.info(`Creating an alert type with body ${JSON.stringify(requestBody)}`)
    return AlertsApiClient.restClient(token).post({ path: '/alert-types', data: requestBody })
  }

  retrieveAlertTypes(token: string): Promise<AlertType[]> {
    logger.info('Retrieving all alert types')
    return AlertsApiClient.restClient(token).get({ path: '/alert-types' })
  }

  createAlertCode(token: string, requestBody: CreateAlertCodeRequest) {
    logger.info(`Creating an alert code with body ${JSON.stringify(requestBody)}`)
    return AlertsApiClient.restClient(token).post({ path: '/alert-codes', data: requestBody })
  }

  deactivateAlertCode(token: string, alertCode: string) {
    logger.info(`Deactivating alert code ${alertCode}`)
    return AlertsApiClient.restClient(token).delete({ path: `/alert-codes/${alertCode}` })
  }

  deactivateAlertType(token: string, alertCode: string) {
    logger.info(`Deactivating alert code ${alertCode}`)
    return AlertsApiClient.restClient(token).delete({ path: `/alert-types/${alertCode}` })
  }
}
