import { RequestHandler } from 'express'
import AlertsApiClient from '../data/alertsApiClient'

const alertsApiClient = new AlertsApiClient()
export default class CreateAlertTypeRoutes {
  public startPage: RequestHandler = async (req, res): Promise<void> => {
    const { alertTypeCode, alertTypeDescription } = req.session
    return res.render('pages/createAlertType/index', { alertTypeCode, alertTypeDescription })
  }

  public submitAlertType: RequestHandler = async (req, res): Promise<void> => {
    const alertTypeCodeErrorMessage = 'An alert type code must be entered'
    const alertTypeDescriptionErrorMessage = 'An alert type description must be entered'
    const { alertTypeCode, alertTypeDescription } = req.body
    if (this.isNullOrEmpty(alertTypeCode) && this.isNullOrEmpty(alertTypeDescription)) {
      return res.render('pages/createAlertType/index', { alertTypeCodeErrorMessage, alertTypeDescriptionErrorMessage })
    }
    if (this.isNullOrEmpty(alertTypeCode)) {
      return res.render('pages/createAlertType/index', { alertTypeCodeErrorMessage, alertTypeDescription })
    }
    if (this.isNullOrEmpty(alertTypeDescription)) {
      return res.render('pages/createAlertType/index', { alertTypeDescriptionErrorMessage, alertTypeCode })
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
    console.log(req.session)
    await alertsApiClient
      .createAlertType(res.locals.user.token, {
        code: alertTypeCode,
        description: alertTypeDescription,
      })
      .then(() => res.render('pages/createAlertType/success', { alertTypeCode, alertTypeDescription, res }))
      .catch(err => {
        console.log(err)
        const alertTypeCodeErrorMessage = `Alert type with code '${alertTypeCode}' already exists`
        switch (err.code) {
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
  }

  private isNullOrEmpty(value: string): boolean {
    return value === null || value === undefined || value === ''
  }
}
