import { RequestHandler } from 'express'
import AlertsApiClient from '../data/alertsApiClient'

export default class ReactivateAlertTypeRoutes {
  constructor(private readonly alertsApiClient: AlertsApiClient) {}

  public startPage: RequestHandler = async (req, res): Promise<void> => {
    const alertTypes = (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken, true))
      .filter(at => !at.isActive)
      .map(alertType => {
        return {
          value: alertType.code,
          text: alertType.code,
          hint: { text: alertType.description },
        }
      })
    return res.render('pages/reactivateAlertType/index', { alertTypes })
  }

  public submitStartPage: RequestHandler = async (req, res): Promise<void> => {
    const { alertType } = req.body
    if (alertType === null || alertType === '' || alertType === undefined) {
      const alertTypeErrorMessage = 'An alert type must be selected.'
      const alertTypes = (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken, true))
        .filter(at => !at.isActive)
        .map(at => {
          return {
            value: at.code,
            text: at.code,
            hint: { text: at.description },
          }
        })
      return res.render('pages/reactivateAlertType/index', { alertTypes, alertTypeErrorMessage })
    }
    req.session.reactivateAlertType = alertType
    return res.redirect('/alert-type/reactivate/confirmation')
  }

  public loadConfirmationPage: RequestHandler = async (req, res): Promise<void> => {
    const { reactivateAlertType } = req.session
    return res.render('pages/reactivateAlertType/confirmation', { reactivateAlertType })
  }

  public submitConfirmationPage: RequestHandler = async (req, res): Promise<void> => {
    const { confirmation } = req.body
    const { reactivateAlertType } = req.session
    if (confirmation === undefined || confirmation === null || confirmation === '') {
      const confirmationErrorMessage = 'You must select either Yes or No.'
      return res.render('pages/reactivateAlertType/confirmation', { reactivateAlertType, confirmationErrorMessage })
    }
    if (confirmation === 'no') {
      return res.redirect('/')
    }
    return res.redirect('/alert-type/reactivate/success')
  }

  public loadSuccessPage: RequestHandler = async (req, res): Promise<void> => {
    const { reactivateAlertType } = req.session
    this.alertsApiClient
      .reactivateAlertType(req.middleware.clientToken, reactivateAlertType)
      .then(response => {
        return res.render('pages/reactivateAlertType/success', {
          reactivateAlertType,
          response,
        })
      })
      .catch(_ => {
        req.session.errorMessage = 'Your alert code was not reactivated'
        return res.redirect('/error-page')
      })
  }
}
