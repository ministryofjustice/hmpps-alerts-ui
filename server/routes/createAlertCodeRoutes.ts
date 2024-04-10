import { Request, RequestHandler } from 'express'
import AlertsApiClient from '../data/alertsApiClient'

export default class CreateAlertCodeRoutes {
  constructor(private readonly alertsApiClient: AlertsApiClient) {}

  public startPage: RequestHandler = async (req, res): Promise<void> => {
    const alertTypes = (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken)).map(alertType => {
      return {
        value: alertType.code,
        text: alertType.code,
        hint: { text: alertType.description },
      }
    })
    return res.render('pages/createAlertCode/index', { alertTypes })
  }

  public submitAlertType: RequestHandler = async (req, res): Promise<void> => {
    if (this.isNullOrEmpty(req.body.alertType)) {
      const alertTypes = (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken)).map(alertType => {
        return {
          value: alertType.code,
          text: alertType.code,
          hint: { text: alertType.description },
        }
      })
      const alertTypeErrorMessage = 'An alert type must be selected'
      return res.render('pages/createAlertCode/index', { alertTypes, alertTypeErrorMessage })
    }
    req.session.alertCodeParentType = req.body.alertType
    return res.redirect('/alertCode/alertCode')
  }

  public loadAlertCode: RequestHandler = async (req, res): Promise<void> => {
    const { alertCode, alertDescription, alertCodeParentType } = req.session
    return res.render('pages/createAlertCode/alertCode', { alertCode, alertDescription, alertCodeParentType })
  }

  public submitAlertCode: RequestHandler = async (req, res): Promise<void> => {
    const { alertCode, alertDescription } = req.body
    const validationMessages = this.validationMessages(req)
    if (validationMessages.alertCodeErrorMessage || validationMessages.alertDescriptionErrorMessage) {
      return res.render('pages/createAlertCode/alertCode', validationMessages)
    }
    req.session.alertCode = alertCode
    req.session.alertDescription = alertDescription
    return res.redirect('/alertCode/confirmation')
  }

  public loadConfirmation: RequestHandler = async (req, res): Promise<void> => {
    const { alertCode, alertDescription, alertCodeParentType } = req.session
    return res.render('pages/createAlertCode/confirmation', { alertCode, alertDescription, alertCodeParentType })
  }

  public submitConfirmation: RequestHandler = async (req, res): Promise<void> => {
    return res.redirect('/alertCode/success')
  }

  public loadSuccess: RequestHandler = async (req, res): Promise<void> => {
    const { alertCode, alertDescription, alertCodeParentType } = req.session
    return res.render('pages/createAlertCode/success', { alertCode, alertDescription, alertCodeParentType })
  }

  private isNullOrEmpty(value: string): boolean {
    return value === null || value === undefined || value === ''
  }

  private validationMessages(req: Request) {
    const { alertCode, alertDescription } = req.body
    let alertCodeErrorMessage
    let alertDescriptionErrorMessage
    if (this.isNullOrEmpty(alertCode) || alertCode.length > 12) {
      alertCodeErrorMessage = 'An alert code must be between 1 and 12 characters'
    }
    if (this.isNullOrEmpty(alertDescription) || alertDescription.length > 40) {
      alertDescriptionErrorMessage = 'An alert description must be between 1 and 40 characters'
    }
    return { alertCode, alertDescription, alertCodeErrorMessage, alertDescriptionErrorMessage }
  }
}
