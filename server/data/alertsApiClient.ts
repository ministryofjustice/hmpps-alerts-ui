import { RestClient } from '@ministryofjustice/hmpps-rest-client'
import { UUID } from 'node:crypto'
import config from '../config'
import logger from '../../logger'
import {
  Alert,
  AlertCode,
  AlertType,
  BulkAlertPlanRequest,
  BulkPlan,
  BulkPlanAffect,
  BulkPlanPrisoners,
  BulkPlanStatus,
  CreateAlertCodeRequest,
  CreateAlertRequest,
  CreateAlertTypeRequest,
  PageAlert,
  UpdateAlertCodeRequest,
  UpdateAlertTypeRequest,
} from '../@types/alerts/alertsApiTypes'

export default class AlertsApiClient extends RestClient {
  constructor() {
    super('Alerts API', config.apis.alertsApi, logger)
  }

  createAlertType(token: string, requestBody: CreateAlertTypeRequest) {
    logger.info(`Creating an alert type with body ${JSON.stringify(requestBody)}`)
    return this.post({ path: '/alert-types', data: requestBody }, token)
  }

  retrieveAlertTypes(token: string, includeInactive: boolean = false): Promise<AlertType[]> {
    logger.info('Retrieving all alert types')
    return this.get(
      {
        path: `/alert-types${includeInactive ? '?includeInactive=true' : ''}`,
      },
      token,
    )
  }

  createAlertCode(token: string, requestBody: CreateAlertCodeRequest) {
    logger.info(`Creating an alert code with body ${JSON.stringify(requestBody)}`)
    return this.post({ path: '/alert-codes', data: requestBody }, token)
  }

  deactivateAlertCode(token: string, alertCode: string) {
    logger.info(`Deactivating alert code ${alertCode}`)
    return this.patch({ path: `/alert-codes/${encodeURIComponent(alertCode)}/deactivate` }, token)
  }

  reactivateAlertCode(token: string, alertCode: string) {
    logger.info(`Reactivating alert code ${alertCode}`)
    return this.patch({ path: `/alert-codes/${encodeURIComponent(alertCode)}/reactivate` }, token)
  }

  deactivateAlertType(token: string, alertCode: string) {
    logger.info(`Deactivating alert type ${alertCode}`)
    return this.patch({ path: `/alert-types/${encodeURIComponent(alertCode)}/deactivate` }, token)
  }

  reactivateAlertType(token: string, alertCode: string) {
    logger.info(`Reactivating alert type ${alertCode}`)
    return this.patch({ path: `/alert-types/${encodeURIComponent(alertCode)}/reactivate` }, token)
  }

  updateAlertType(token: string, code: string, requestBody: UpdateAlertTypeRequest): Promise<AlertType> {
    logger.info(`Updating alert type ${code}`)
    return this.patch(
      {
        path: `/alert-types/${encodeURIComponent(code)}`,
        data: requestBody,
      },
      token,
    )
  }

  updateAlertCode(token: string, code: string, requestBody: UpdateAlertCodeRequest): Promise<AlertCode> {
    logger.info(`Updating alert code ${code}`)
    return this.patch(
      {
        path: `/alert-codes/${encodeURIComponent(code)}`,
        data: requestBody,
      },
      token,
    )
  }

  createAlert(token: string, prisonNumber: string, requestBody: CreateAlertRequest) {
    return this.post(
      {
        path: `/prisoners/${prisonNumber}/alerts?allowInactiveCode=true`,
        data: requestBody,
      },
      token,
    )
  }

  deleteAlert(token: string, alertUuid: UUID) {
    return this.delete(
      {
        path: `/alerts/${alertUuid}`,
      },
      token,
    )
  }

  getAlert(token: string, alertUuid: UUID): Promise<Alert> {
    return this.get(
      {
        path: `/alerts/${alertUuid}`,
      },
      token,
    )
  }

  getPrisonerActiveAlertForAlertCode(token: string, prisonNumber: string, code: string): Promise<PageAlert> {
    return this.get(
      {
        path: `/prisoners/${prisonNumber}/alerts?isActive=true&alertCode=${code}`,
      },
      token,
    )
  }

  createBulkAlertsPlan(token: string): Promise<BulkPlan> {
    return this.post(
      {
        path: `/bulk-alerts/plan`,
      },
      token,
    )
  }

  addPrisonersToBulkAlertsPlan(token: string, planId: string, prisonNumbers: string[]): Promise<BulkPlan> {
    return this.patch(
      {
        path: `/bulk-alerts/plan/${planId}`,
        data: [
          {
            type: 'AddPrisonNumbers',
            prisonNumbers,
          },
        ],
      },
      token,
    )
  }

  removePrisonersFromBulkAlertsPlan(token: string, planId: string, prisonNumber: string): Promise<BulkPlan> {
    return this.patch(
      {
        path: `/bulk-alerts/plan/${planId}`,
        data: [
          {
            type: 'RemovePrisonNumbers',
            prisonNumbers: [prisonNumber],
          },
        ],
      },
      token,
    )
  }

  patchBulkAlertsPlan(token: string, planId: string, requestBody: BulkAlertPlanRequest): Promise<BulkPlan> {
    return this.patch(
      {
        path: `/bulk-alerts/plan/${planId}`,
        data: [
          {
            type: 'SetAlertCode',
            alertCode: requestBody.alertCode,
          },
          {
            type: 'SetDescription',
            description: requestBody.description,
          },
          {
            type: 'SetCleanupMode',
            cleanupMode: requestBody.cleanupMode,
          },
        ],
      },
      token,
    )
  }

  startBulkAlertsPlan(token: string, planId: string) {
    return this.post(
      {
        path: `/bulk-alerts/plan/${planId}/start`,
      },
      token,
    )
  }

  getPrisonersFromBulkAlertsPlan(token: string, planId: string): Promise<BulkPlanPrisoners> {
    return this.get(
      {
        path: `/bulk-alerts/plan/${planId}/prisoners`,
      },
      token,
    )
  }

  getResultFromBulkAlertsPlan(token: string, planId: string): Promise<BulkPlanStatus> {
    return this.get(
      {
        path: `/bulk-alerts/plan/${planId}/status`,
      },
      token,
    )
  }

  getBulkAlertsPlan(token: string, planId: string): Promise<BulkPlanAffect> {
    return this.get(
      {
        path: `/bulk-alerts/plan/${planId}/affects`,
      },
      token,
    )
  }

  restrictAlertCode(token: string, alertCode: string) {
    logger.info(`Restricting alert code ${alertCode}`)
    return this.patch({ path: `/alert-codes/${encodeURIComponent(alertCode)}/restrict` }, token)
  }

  removeRestrictionsForAlertCode(token: string, alertCode: string) {
    logger.info(`Removing restrictions for alert code ${alertCode}`)
    return this.patch({ path: `/alert-codes/${encodeURIComponent(alertCode)}/remove-restriction` }, token)
  }

  addPrivilegedUser(token: string, alertCode: string, username: string) {
    logger.info(`Adding privileged user for alert code ${alertCode}`)
    return this.post(
      { path: `/alert-codes/${encodeURIComponent(alertCode)}/privileged-user/${encodeURIComponent(username)}` },
      token,
    )
  }

  removePrivilegedUser(token: string, alertCode: string, username: string) {
    logger.info(`Removing privileged user for alert code ${alertCode}`)
    return this.delete(
      { path: `/alert-codes/${encodeURIComponent(alertCode)}/privileged-user/${encodeURIComponent(username)}` },
      token,
    )
  }
}
