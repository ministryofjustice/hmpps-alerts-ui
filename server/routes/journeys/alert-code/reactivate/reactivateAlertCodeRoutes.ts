import { Request, RequestHandler } from 'express'
import AlertsApiClient from '../../../../data/alertsApiClient'

export default class ReactivateAlertCodeRoutes {
  constructor(private readonly alertsApiClient: AlertsApiClient) {}

  public startPage: RequestHandler = async (req, res): Promise<void> => {
    req.journeyData.refData ??= {}
    const alertTypes = (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken, true))
      .filter(at => at.alertCodes?.find(ac => !ac.isActive))
      .map(alertType => {
        return {
          value: alertType.code,
          text: alertType.code,
          hint: { text: alertType.description },
        }
      })
    return res.render('pages/reactivateAlertCode/index', { alertTypes })
  }

  public submitStartPage: RequestHandler = async (req, res): Promise<void> => {
    const { alertType } = req.body
    if (alertType === null || alertType === '' || alertType === undefined) {
      const alertTypeErrorMessage = 'An alert type must be selected.'
      const alertTypes = (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken, true))
        .filter(at => at.alertCodes?.find(ac => !ac.isActive))
        .map(at => {
          return {
            value: at.code,
            text: at.code,
            hint: { text: at.description },
          }
        })
      return res.render('pages/reactivateAlertCode/index', { alertTypes, alertTypeErrorMessage })
    }
    req.journeyData.refData!.deactivateAlertTypeCode = alertType
    return res.redirect('reactivate/alert-code')
  }

  public loadAlertCodesPage: RequestHandler = async (req, res): Promise<void> => {
    const { alertType, codes } = await this.getAlertDetails(req)
    if (codes === undefined || codes.length === 0) {
      req.session.errorMessage = `There are no codes associated with alert type ${alertType!.code}`
      return res.redirect('/error-page')
    }
    return res.render('pages/reactivateAlertCode/alertCodes', { alertType, codes })
  }

  private getAlertDetails = async (req: Request) => {
    const { deactivateAlertTypeCode } = req.journeyData.refData!
    const alertType = (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken, true)).find(
      at => at.code === deactivateAlertTypeCode,
    )
    let codes
    if (alertType?.alertCodes !== undefined && alertType.alertCodes.length !== 0) {
      codes = alertType.alertCodes
        .filter(ac => !ac.isActive)
        .map(ac => {
          return {
            value: ac.code,
            text: ac.code,
            hint: { text: ac.description },
          }
        })
    }
    return { alertType, codes }
  }

  public submitAlertCodesPage: RequestHandler = async (req, res): Promise<void> => {
    const { alertCode } = req.body
    if (alertCode === undefined || alertCode === null || alertCode === '') {
      const { alertType, codes } = await this.getAlertDetails(req)
      const alertCodeErrorMessage = 'An alert code must be selected'
      return res.render('pages/reactivateAlertCode/alertCodes', { alertType, codes, alertCodeErrorMessage })
    }
    req.journeyData.refData!.reactivateAlertCode = alertCode
    return res.redirect('confirmation')
  }

  public loadConfirmationPage: RequestHandler = async (req, res): Promise<void> => {
    const { reactivateAlertCode } = req.journeyData.refData!
    return res.render('pages/reactivateAlertCode/confirmation', { reactivateAlertCode })
  }

  public submitConfirmationPage: RequestHandler = async (req, res): Promise<void> => {
    const { confirmation } = req.body
    if (confirmation === undefined || confirmation === null || confirmation === '') {
      const { reactivateAlertCode } = req.journeyData.refData!
      const confirmationErrorMessage = 'You must select either Yes or No.'
      return res.render('pages/reactivateAlertCode/confirmation', { reactivateAlertCode, confirmationErrorMessage })
    }
    if (confirmation === 'no') {
      return res.redirect('/')
    }
    return res.redirect('success')
  }

  public loadSuccessPage: RequestHandler = async (req, res): Promise<void> => {
    const { reactivateAlertCode } = req.journeyData.refData!
    this.alertsApiClient
      .reactivateAlertCode(req.middleware.clientToken, reactivateAlertCode!)
      .then(response => {
        return res.render('pages/reactivateAlertCode/success', {
          reactivateAlertCode,
          response,
        })
      })
      .catch(_ => {
        req.session.errorMessage = 'Your alert code was not reactivated'
        return res.redirect('/error-page')
      })
  }
}
