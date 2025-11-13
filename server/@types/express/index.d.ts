import { CaseLoad, HmppsUser } from '../../interfaces/hmppsUser'
import { AlertCode, AlertType, BulkPlanStatus } from '../alerts/alertsApiTypes'
import { Prisoner } from '../../data/prisonerSearchApiClient'

export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    errorMessage: string
  }
}

export type JourneyData = {
  instanceUnixEpoch: number
  isCheckAnswers?: boolean
  journeyCompleted?: boolean
  bulkAlert?: BulkAlertJourney
  refData?: ReferenceDataJourney
  updateRefData?: UpdateReferenceDataJourney
  restrictAlert?: ManageAlertRestrictionsJourney
}

export type BulkAlertJourney = Partial<{
  planId: string
  alertCodeSubJourney: BulkAlertJourney
  alertType: Omit<AlertType, 'alertCodes'>
  alertCode: AlertCode
  description: string
  useCsvUpload: boolean
  query: string
  prisonersSearched: Prisoner[]
  prisonersSelectedCount: number
  cleanupMode: 'KEEP_ALL' | 'EXPIRE_FOR_PRISON_NUMBERS_NOT_SPECIFIED'
  result: BulkPlanStatus['counts']
}>

export type ReferenceDataJourney = Partial<{
  alertTypeCode: string
  alertTypeDescription: string
  alertCodeParentType: string
  alertCode: string
  alertDescription: string
  deactivateAlertTypeCode: string
  deactivateAlertCode: string
  reactivateAlertCode: string
  deactivateAlertType: string
  reactivateAlertType: string
  updateAlertTypeCode: string
}>

export type UpdateReferenceDataJourney = Partial<{
  referenceDataType: 'ALERT_CODE' | 'ALERT_TYPE'
  changeType: 'ADD_NEW' | 'EDIT_DESCRIPTION' | 'DEACTIVATE' | 'REACTIVATE'
  updateAlertCodeSubJourney: { alertType: Omit<AlertType, 'alertCodes'> }
  alertType: Omit<AlertType, 'alertCodes'>
  alertCode: AlertCode
  code: string
  description: string
}>

export type ManageAlertRestrictionsJourney = Partial<{
  changeType: 'RESTRICT_ALERT' | 'REMOVE_ALERT_RESTRICTION' | 'ADD_PRIVILEGED_USER' | 'REMOVE_PRIVILEGED_USER'
  alertType: Omit<AlertType, 'alertCodes'>
  alertCode: AlertCode
  username: string
  code: string
}>

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
      middleware: { clientToken: string }
      journeyData: JourneyData
    }

    interface Locals {
      user: HmppsUser
      validationErrors?: fieldErrors
      digitalPrisonServicesUrl: string
      breadcrumbs: Breadcrumbs
      prisoner?: PrisonerSummary
      formResponses?: { [key: string]: string }
      appInsightsConnectionString?: string
      appInsightsApplicationName?: string
      buildNumber?: string
      asset_path: string
      applicationName: string
      environment: 'local' | 'dev' | 'preprod' | 'prod'
      environmentName: string
      environmentNameColour: string
      csrfToken: string
      cspNonce: string
      message: string
      stack: string | undefined | null
      status: number
      feComponents?: {
        sharedData?: {
          activeCaseLoad: CaseLoad
          caseLoads: CaseLoad[]
          services: {
            id: string
            heading: string
            description: string
            href: string
            navEnabled: boolean
          }[]
        }
      }
      auditEvent: {
        pageNameSuffix: string
        who: string
        correlationId: string
        subjectId?: string
        subjectType?: string
        details: Record<string, unknown>
      }
    }
  }
}
