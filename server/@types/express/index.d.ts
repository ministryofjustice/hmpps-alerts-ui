import { HmppsUser } from '../../interfaces/hmppsUser'

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
  }
}

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
    }
  }
}
