import { CaseLoad, HmppsUser } from '../../interfaces/hmppsUser'
import { AlertCode, AlertType, BulkPlanStatus } from '../alerts/alertsApiTypes'
import { Prisoner } from '../../data/prisonerSearchApiClient'

export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
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
  alertType: Omit<AlertType, 'alertCodes'>
  alertCode: AlertCode
  code: string
  description: string
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
