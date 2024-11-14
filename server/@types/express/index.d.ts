import { CaseLoad, HmppsUser } from '../../interfaces/hmppsUser'
import { AlertCode, AlertType } from '../alerts/alertsApiTypes'
import { Prisoner } from '../../data/prisonerSearchApiClient'

export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    alertTypeCode: string
    alertTypeDescription: string
    alertCodeParentType: string
    alertCode: string
    alertDescription: string
    errorMessage: string
    deactivateAlertTypeCode: string
    deactivateAlertCode: string
    reactivateAlertCode: string
    deactivateAlertType: string
    reactivateAlertType: string
    updateAlertTypeCode: string
    journeyDataMap: JourneyDataMap
  }
}

type JourneyDataMap = {
  [key: string]: JourneyData
}

export type JourneyData = {
  instanceUnixEpoch: number
  isCheckAnswers?: boolean
  journeyCompleted?: boolean
  bulkAlert?: BulkAlertJourney
}

export type BulkAlertJourney = Partial<{
  alertType: Omit<AlertType, 'alertCodes'>
  alertCode: AlertCode
  description: string
  useCsvUpload: boolean
  query: string
  prisonersSearched: Prisoner[]
  prisonersSelected: Prisoner[]
  cleanupMode: 'KEEP_ALL' | 'EXPIRE_FOR_PRISON_NUMBERS_NOT_SPECIFIED'
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
      feComponentsMeta?: {
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
  }
}
