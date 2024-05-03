import RestClient from './restClient'
import config from '../config'
import logger from '../../logger'
import {
  AlertCode,
  AlertType,
  CreateAlertCodeRequest,
  CreateAlertTypeRequest,
  UpdateAlertCodeRequest,
  UpdateAlertTypeRequest,
} from '../@types/alerts/alertsApiTypes'

export default class AlertsApiClient {
  constructor() {}

  private static restClient(token: string): RestClient {
    return new RestClient('Alerts Api Client', config.apis.alertsApi, token)
  }

  createAlertType(token: string, requestBody: CreateAlertTypeRequest) {
    logger.info(`Creating an alert type with body ${JSON.stringify(requestBody)}`)
    return AlertsApiClient.restClient(token).post({ path: '/alert-types', data: requestBody })
  }

  retrieveAlertTypes(token: string, includeInactive: boolean = false): Promise<AlertType[]> {
    logger.info('Retrieving all alert types')
    return AlertsApiClient.restClient(token).get({
      path: `/alert-types${includeInactive ? '?includeInactive=true' : ''}`,
    })
  }

  createAlertCode(token: string, requestBody: CreateAlertCodeRequest) {
    logger.info(`Creating an alert code with body ${JSON.stringify(requestBody)}`)
    return AlertsApiClient.restClient(token).post({ path: '/alert-codes', data: requestBody })
  }

  deactivateAlertCode(token: string, alertCode: string) {
    logger.info(`Deactivating alert code ${alertCode}`)
    return AlertsApiClient.restClient(token).patch({ path: `/alert-codes/${alertCode}/deactivate` })
  }

  reactivateAlertCode(token: string, alertCode: string) {
    logger.info(`Reactivating alert code ${alertCode}`)
    return AlertsApiClient.restClient(token).patch({ path: `/alert-codes/${alertCode}/reactivate` })
  }

  deactivateAlertType(token: string, alertCode: string) {
    logger.info(`Deactivating alert type ${alertCode}`)
    return AlertsApiClient.restClient(token).patch({ path: `/alert-types/${alertCode}/deactivate` })
  }

  reactivateAlertType(token: string, alertCode: string) {
    logger.info(`Reactivating alert type ${alertCode}`)
    return AlertsApiClient.restClient(token).patch({ path: `/alert-types/${alertCode}/reactivate` })
  }

  updateAlertType(token: string, code: string, requestBody: UpdateAlertTypeRequest): Promise<AlertType> {
    logger.info(`Updating alert type ${code}`)
    return AlertsApiClient.restClient(token).patch({ path: `/alert-types/${code}`, data: requestBody })
  }

  updateAlertCode(token: string, code: string, requestBody: UpdateAlertCodeRequest): Promise<AlertCode> {
    logger.info(`Updating alert code ${code}`)
    return AlertsApiClient.restClient(token).patch({ path: `/alert-codes/${code}`, data: requestBody })
  }
}
