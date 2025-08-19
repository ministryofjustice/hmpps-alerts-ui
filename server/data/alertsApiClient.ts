import { asUser, RestClient } from '@ministryofjustice/hmpps-rest-client'
import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import logger from '../../logger'
import {
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
  constructor(authenticationClient: AuthenticationClient) {
    super('Alerts API', config.apis.alertsApi, logger, authenticationClient)
  }

  createAlertType(token: string, requestBody: CreateAlertTypeRequest) {
    logger.info(`Creating an alert type with body ${JSON.stringify(requestBody)}`)
    return this.post({ path: '/alert-types', data: requestBody }, asUser(token))
  }

  retrieveAlertTypes(token: string, includeInactive: boolean = false): Promise<AlertType[]> {
    logger.info('Retrieving all alert types')
    return this.get(
      {
        path: `/alert-types${includeInactive ? '?includeInactive=true' : ''}`,
      },
      asUser(token),
    )
  }

  createAlertCode(token: string, requestBody: CreateAlertCodeRequest) {
    logger.info(`Creating an alert code with body ${JSON.stringify(requestBody)}`)
    return this.post({ path: '/alert-codes', data: requestBody }, asUser(token))
  }

  deactivateAlertCode(token: string, alertCode: string) {
    logger.info(`Deactivating alert code ${alertCode}`)
    return this.patch({ path: `/alert-codes/${encodeURIComponent(alertCode)}/deactivate` }, asUser(token))
  }

  reactivateAlertCode(token: string, alertCode: string) {
    logger.info(`Reactivating alert code ${alertCode}`)
    return this.patch({ path: `/alert-codes/${encodeURIComponent(alertCode)}/reactivate` }, asUser(token))
  }

  deactivateAlertType(token: string, alertCode: string) {
    logger.info(`Deactivating alert type ${alertCode}`)
    return this.patch({ path: `/alert-types/${encodeURIComponent(alertCode)}/deactivate` }, asUser(token))
  }

  reactivateAlertType(token: string, alertCode: string) {
    logger.info(`Reactivating alert type ${alertCode}`)
    return this.patch({ path: `/alert-types/${encodeURIComponent(alertCode)}/reactivate` }, asUser(token))
  }

  updateAlertType(token: string, code: string, requestBody: UpdateAlertTypeRequest): Promise<AlertType> {
    logger.info(`Updating alert type ${code}`)
    return this.patch(
      {
        path: `/alert-types/${encodeURIComponent(code)}`,
        data: requestBody,
      },
      asUser(token),
    )
  }

  updateAlertCode(token: string, code: string, requestBody: UpdateAlertCodeRequest): Promise<AlertCode> {
    logger.info(`Updating alert code ${code}`)
    return this.patch(
      {
        path: `/alert-codes/${encodeURIComponent(code)}`,
        data: requestBody,
      },
      asUser(token),
    )
  }

  createAlert(token: string, prisonNumber: string, requestBody: CreateAlertRequest) {
    return this.post(
      {
        path: `/prisoners/${prisonNumber}/alerts?allowInactiveCode=true`,
        data: requestBody,
      },
      asUser(token),
    )
  }

  getPrisonerActiveAlertForAlertCode(token: string, prisonNumber: string, code: string): Promise<PageAlert> {
    return this.get(
      {
        path: `/prisoners/${prisonNumber}/alerts?isActive=true&alertCode=${code}`,
      },
      asUser(token),
    )
  }

  createBulkAlertsPlan(token: string): Promise<BulkPlan> {
    return this.post(
      {
        path: `/bulk-alerts/plan`,
      },
      asUser(token),
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
      asUser(token),
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
      asUser(token),
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
      asUser(token),
    )
  }

  startBulkAlertsPlan(token: string, planId: string) {
    return this.post(
      {
        path: `/bulk-alerts/plan/${planId}/start`,
      },
      asUser(token),
    )
  }

  getPrisonersFromBulkAlertsPlan(token: string, planId: string): Promise<BulkPlanPrisoners> {
    return this.get(
      {
        path: `/bulk-alerts/plan/${planId}/prisoners`,
      },
      asUser(token),
    )
  }

  getResultFromBulkAlertsPlan(token: string, planId: string): Promise<BulkPlanStatus> {
    return this.get(
      {
        path: `/bulk-alerts/plan/${planId}/status`,
      },
      asUser(token),
    )
  }

  getBulkAlertsPlan(token: string, planId: string): Promise<BulkPlanAffect> {
    return this.get(
      {
        path: `/bulk-alerts/plan/${planId}/affects`,
      },
      asUser(token),
    )
  }
}
