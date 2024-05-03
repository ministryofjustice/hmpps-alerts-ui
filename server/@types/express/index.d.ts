import type { UserDetails } from '../../services/userService'

export default {}

declare module 'express-session' {
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
    deactivateAlertType: string
    reactivateAlertType: string
    updateAlertTypeCode: string
  }
}

export declare global {
  namespace Express {
    interface User extends Partial<UserDetails> {
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
      middleware?: Record
    }

    interface Locals {
      user: Express.User
    }
  }
}
