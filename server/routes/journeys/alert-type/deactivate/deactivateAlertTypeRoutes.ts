import { RequestHandler } from 'express'
import AlertsApiClient from '../../../../data/alertsApiClient'

export default class DeactivateAlertTypeRoutes {
  constructor(private readonly alertsApiClient: AlertsApiClient) {}

  public startPage: RequestHandler = async (req, res): Promise<void> => {
    req.journeyData.refData ??= {}
    const alertTypes = (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken))
      .filter(at => at.isActive)
      .map(alertType => {
        return {
          value: alertType.code,
          text: alertType.code,
          hint: { text: alertType.description },
        }
      })
    return res.render('pages/deactivateAlertType/index', { alertTypes })
  }

  public submitStartPage: RequestHandler = async (req, res): Promise<void> => {
    const { alertType } = req.body
    if (alertType === null || alertType === '' || alertType === undefined) {
      const alertTypeErrorMessage = 'An alert type must be selected.'
      const alertTypes = (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken))
        .filter(at => at.isActive)
        .map(at => {
          return {
            value: at.code,
            text: at.code,
            hint: { text: at.description },
          }
        })
      return res.render('pages/deactivateAlertType/index', { alertTypes, alertTypeErrorMessage })
    }
    req.journeyData.refData!.deactivateAlertType = alertType
    return res.redirect('deactivate/confirmation')
  }

  public loadConfirmationPage: RequestHandler = async (req, res): Promise<void> => {
    const { deactivateAlertType } = req.journeyData.refData!
    return res.render('pages/deactivateAlertType/confirmation', { deactivateAlertType })
  }

  public submitConfirmationPage: RequestHandler = async (req, res): Promise<void> => {
    const { confirmation } = req.body
    const { deactivateAlertType } = req.journeyData.refData!
    if (confirmation === undefined || confirmation === null || confirmation === '') {
      const confirmationErrorMessage = 'You must select either Yes or No.'
      return res.render('pages/deactivateAlertType/confirmation', { deactivateAlertType, confirmationErrorMessage })
    }
    if (confirmation === 'no') {
      return res.redirect('/')
    }
    return res.redirect('success')
  }

  public loadSuccessPage: RequestHandler = async (req, res): Promise<void> => {
    const { deactivateAlertType } = req.journeyData.refData!
    this.alertsApiClient
      .deactivateAlertType(req.middleware.clientToken, deactivateAlertType!)
      .then(response => {
        return res.render('pages/deactivateAlertType/success', {
          deactivateAlertType,
          response,
        })
      })
      .catch(_ => {
        req.session.errorMessage = 'Your alert code was not deactivated'
        return res.redirect('/error-page')
      })
  }
}
