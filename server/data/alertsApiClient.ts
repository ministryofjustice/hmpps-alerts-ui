import RestClient from './restClient'
import config from '../config'
import logger from '../../logger'
import {
  AlertCode,
  AlertType,
  BulkAlert,
  BulkAlertPlan,
  BulkAlertsRequest,
  CreateAlertCodeRequest,
  CreateAlertRequest,
  CreateAlertTypeRequest,
  PageAlert,
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
    return AlertsApiClient.restClient(token).patch({ path: `/alert-codes/${encodeURIComponent(alertCode)}/deactivate` })
  }

  reactivateAlertCode(token: string, alertCode: string) {
    logger.info(`Reactivating alert code ${alertCode}`)
    return AlertsApiClient.restClient(token).patch({ path: `/alert-codes/${encodeURIComponent(alertCode)}/reactivate` })
  }

  deactivateAlertType(token: string, alertCode: string) {
    logger.info(`Deactivating alert type ${alertCode}`)
    return AlertsApiClient.restClient(token).patch({ path: `/alert-types/${encodeURIComponent(alertCode)}/deactivate` })
  }

  reactivateAlertType(token: string, alertCode: string) {
    logger.info(`Reactivating alert type ${alertCode}`)
    return AlertsApiClient.restClient(token).patch({ path: `/alert-types/${encodeURIComponent(alertCode)}/reactivate` })
  }

  updateAlertType(token: string, code: string, requestBody: UpdateAlertTypeRequest): Promise<AlertType> {
    logger.info(`Updating alert type ${code}`)
    return AlertsApiClient.restClient(token).patch({
      path: `/alert-types/${encodeURIComponent(code)}`,
      data: requestBody,
    })
  }

  updateAlertCode(token: string, code: string, requestBody: UpdateAlertCodeRequest): Promise<AlertCode> {
    logger.info(`Updating alert code ${code}`)
    return AlertsApiClient.restClient(token).patch({
      path: `/alert-codes/${encodeURIComponent(code)}`,
      data: requestBody,
    })
  }

  createAlert(token: string, prisonNumber: string, requestBody: CreateAlertRequest) {
    return AlertsApiClient.restClient(token).post({
      path: `/prisoners/${prisonNumber}/alerts?allowInactiveCode=true`,
      data: requestBody,
    })
  }

  getPrisonerActiveAlertForAlertCode(token: string, prisonNumber: string, code: string): Promise<PageAlert> {
    return AlertsApiClient.restClient(token).get({
      path: `/prisoners/${prisonNumber}/alerts?isActive=true&alertCode=${code}`,
    })
  }

  planBulkAlerts(token: string, requestBody: BulkAlertsRequest): Promise<BulkAlertPlan> {
    return AlertsApiClient.restClient(token).post({
      path: `/bulk-alerts/plan`,
      data: requestBody,
    })
  }

  createBulkAlerts(token: string, requestBody: BulkAlertsRequest): Promise<BulkAlert> {
    return AlertsApiClient.restClient(token).post({
      path: `/bulk-alerts`,
      data: requestBody,
    })
  }
}
