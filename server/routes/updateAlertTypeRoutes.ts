import { Request, RequestHandler } from 'express'
import AlertsApiClient from '../data/alertsApiClient'

export default class UpdateAlertTypeRoutes {
  constructor(private readonly alertsApiClient: AlertsApiClient) {}

  public startPage: RequestHandler = async (req, res): Promise<void> => {
    const alertTypes = (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken))
      .filter(at => at.isActive)
      .map(alertType => {
        return {
          value: alertType.code,
          text: alertType.code,
          hint: { text: alertType.description },
        }
      })
    return res.render('pages/updateAlertType/index', { alertTypes })
  }

  public storeAlertType: RequestHandler = async (req, res): Promise<void> => {
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
      return res.render('pages/updateAlertType/index', { alertTypes, alertTypeErrorMessage })
    }
    req.session.updateAlertTypeCode = alertType
    return res.redirect('/alert-type/update-description/submit-description')
  }

  public loadSubmitDescription: RequestHandler = async (req, res): Promise<void> => {
    const alertType = await this.getAlertTypeDetails(req)
    const { code, description } = alertType
    return res.render('pages/updateAlertType/submitDescription', { code, description })
  }

  public saveSubmitDescription: RequestHandler = async (req, res): Promise<void> => {
    const { descriptionEntry } = req.body
    if (!descriptionEntry || descriptionEntry.length === 0 || descriptionEntry > 40) {
      const { code } = await this.getAlertTypeDetails(req)
      return res.render('pages/updateAlertType/submitDescription', {
        code,
        description: descriptionEntry,
        alertTypeDescriptionErrorMessage: 'An alert type description must be between 1 and 40 characters',
      })
    }
    req.session.alertTypeDescription = descriptionEntry
    return res.redirect('/alert-type/update-description/confirmation')
  }

  public loadConfirmation: RequestHandler = async (req, res): Promise<void> => {
    const { updateAlertTypeCode, alertTypeDescription } = req.session
    return res.render('pages/updateAlertType/confirmation', {
      code: updateAlertTypeCode,
      description: alertTypeDescription,
    })
  }

  private getAlertTypeDetails = async (req: Request) => {
    const { updateAlertTypeCode } = req.session
    return (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken)).find(
      at => at.code === updateAlertTypeCode && at.isActive,
    )
  }
}
