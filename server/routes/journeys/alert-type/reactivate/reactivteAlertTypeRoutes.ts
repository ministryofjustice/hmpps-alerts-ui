import { RequestHandler } from 'express'
import AlertsApiClient from '../../../../data/alertsApiClient'
import AuditService from '../../../../services/auditService'

export default class ReactivateAlertTypeRoutes {
  constructor(
    private readonly alertsApiClient: AlertsApiClient,
    readonly auditService: AuditService,
  ) {}

  public startPage: RequestHandler = async (req, res): Promise<void> => {
    req.journeyData.refData ??= {}
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
    req.journeyData.refData!.reactivateAlertType = alertType
    return res.redirect('reactivate/confirmation')
  }

  public loadConfirmationPage: RequestHandler = async (req, res): Promise<void> => {
    const { reactivateAlertType } = req.journeyData.refData!
    return res.render('pages/reactivateAlertType/confirmation', { reactivateAlertType })
  }

  public submitConfirmationPage: RequestHandler = async (req, res): Promise<void> => {
    const { confirmation } = req.body
    const { reactivateAlertType } = req.journeyData.refData!
    if (confirmation === undefined || confirmation === null || confirmation === '') {
      const confirmationErrorMessage = 'You must select either Yes or No.'
      return res.render('pages/reactivateAlertType/confirmation', { reactivateAlertType, confirmationErrorMessage })
    }
    if (confirmation === 'no') {
      return res.redirect('/')
    }
    return res.redirect('success')
  }

  public loadSuccessPage: RequestHandler = async (req, res): Promise<void> => {
    const { reactivateAlertType } = req.journeyData.refData!
    await this.auditService.logModificationApiCall(
      'ATTEMPT',
      'UPDATE',
      req.originalUrl,
      req.journeyData,
      res.locals.auditEvent,
    )
    this.alertsApiClient
      .reactivateAlertType(req.middleware.clientToken, reactivateAlertType!)
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
    await this.auditService.logModificationApiCall(
      'SUCCESS',
      'UPDATE',
      req.originalUrl,
      req.journeyData,
      res.locals.auditEvent,
    )
  }
}