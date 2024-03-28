import { Request, RequestHandler } from 'express'
import AlertsApiClient from '../data/alertsApiClient'
import logger from '../../logger'

const alertsApiClient = new AlertsApiClient()
export default class CreateAlertTypeRoutes {
  public startPage: RequestHandler = async (req, res): Promise<void> => {
    const { alertTypeCode, alertTypeDescription } = req.session
    return res.render('pages/createAlertType/index', { alertTypeCode, alertTypeDescription })
  }

  public submitAlertType: RequestHandler = async (req, res): Promise<void> => {
    const { alertTypeCode, alertTypeDescription } = req.body
    const validationMessages = this.validationMessages(req)
    if (validationMessages.alertTypeCodeErrorMessage || validationMessages.alertTypeDescriptionErrorMessage) {
      return res.render('pages/createAlertType/index', validationMessages)
    }
    req.session.alertTypeCode = alertTypeCode
    req.session.alertTypeDescription = alertTypeDescription
    return res.redirect('/alertType/confirmation')
  }

  public loadConfirmation: RequestHandler = async (req, res): Promise<void> => {
    const { alertTypeCode, alertTypeDescription } = req.session
    return res.render('pages/createAlertType/confirmation', { alertTypeCode, alertTypeDescription })
  }

  public submitConfirmation: RequestHandler = async (req, res): Promise<void> => {
    return res.redirect('/alertType/success')
  }

  public loadSuccess: RequestHandler = async (req, res): Promise<void> => {
    const { alertTypeCode, alertTypeDescription } = req.session
    const response = await alertsApiClient
      .createAlertType(req.middleware.clientToken, {
        code: alertTypeCode,
        description: alertTypeDescription,
      })
      .catch(err => {
        const alertTypeCodeErrorMessage = `Alert type with code '${alertTypeCode}' already exists`
        switch (err.data.status) {
          case 409:
            return res.render('pages/createAlertType/index', {
              alertTypeCodeErrorMessage,
              alertTypeCode,
              alertTypeDescription,
            })
          default:
            return res.render('pages/createAlertType/error')
        }
      })
    return res.render('pages/createAlertType/success', { alertTypeCode, alertTypeDescription, response })
  }

  private isNullOrEmpty(value: string): boolean {
    return value === null || value === undefined || value === ''
  }

  private validationMessages(req: Request) {
    const { alertTypeCode, alertTypeDescription } = req.body
    let alertTypeCodeErrorMessage
    let alertTypeDescriptionErrorMessage
    if (this.isNullOrEmpty(alertTypeCode) || alertTypeCode.length > 12) {
      alertTypeCodeErrorMessage = 'An alert type code must be between 1 and 12 characters'
    }
    if (this.isNullOrEmpty(alertTypeDescription) || alertTypeDescription.length > 40) {
      alertTypeDescriptionErrorMessage = 'An alert type description must be between 1 and 40 characters'
    }
    return { alertTypeCode, alertTypeDescription, alertTypeCodeErrorMessage, alertTypeDescriptionErrorMessage }
  }
}
