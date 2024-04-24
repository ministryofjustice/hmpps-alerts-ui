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
    return res.redirect('/alertType/updateDescription/submitDescription')
  }

  public loadSubmitDescription: RequestHandler = async (req, res): Promise<void> => {
    const alertType = await this.getAlertTypeDetails(req)
    const { code, description } = alertType
    return res.render('pages/updateAlertType/submitDescription', { code, description })
  }

  private getAlertTypeDetails = async (req: Request) => {
    const { updateAlertTypeCode } = req.session
    return (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken)).find(
      at => at.code === updateAlertTypeCode && at.isActive,
    )
  }
}
