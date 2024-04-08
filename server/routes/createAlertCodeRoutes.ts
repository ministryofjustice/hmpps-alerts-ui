import { RequestHandler } from 'express'
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
    req.session.alertCodeParentType = req.body.alertType
    return res.redirect('/alertCode/alertCode')
  }

  public loadAlertCode: RequestHandler = async (req, res): Promise<void> => {
    const { alertCodeParentType } = req.session
    return res.render('pages/createAlertCode/alertCode', { alertCodeParentType })
  }
}
