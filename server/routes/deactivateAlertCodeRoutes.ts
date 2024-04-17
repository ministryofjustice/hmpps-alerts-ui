import { RequestHandler } from 'express'
import AlertsApiClient from '../data/alertsApiClient'

export default class DeactivateAlertCodeRoutes {
  constructor(private readonly alertsApiClient: AlertsApiClient) {}

  public startPage: RequestHandler = async (req, res): Promise<void> => {
    const alertTypes = (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken)).map(alertType => {
      return {
        value: alertType.code,
        text: alertType.code,
        hint: { text: alertType.description },
      }
    })
    return res.render('pages/deactivateAlertCode/index', { alertTypes })
  }

  public submitStartPage: RequestHandler = async (req, res): Promise<void> => {
    const { alertType } = req.body
    if (alertType === null || alertType === '' || alertType === undefined) {
      const alertTypeErrorMessage = 'An alert type must be selected.'
      const alertTypes = (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken)).map(at => {
        return {
          value: at.code,
          text: at.code,
          hint: { text: at.description },
        }
      })
      return res.render('pages/deactivateAlertCode/index', { alertTypes, alertTypeErrorMessage })
    }
    req.session.deactivateAlertTypeCode = alertType
    return res.redirect('/alertCode/deactivate/alertCode')
  }

  public loadAlertCodesPage: RequestHandler = async (req, res): Promise<void> => {
    const { deactivateAlertTypeCode } = req.session
    const alertType = (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken)).find(
      at => at.code === deactivateAlertTypeCode,
    )
    if (alertType.alertCodes === undefined || alertType.alertCodes.length === 0) {
      req.session.errorMessage = `There are no codes associated with alert type ${alertType.code}`
      return res.redirect('/errorPage')
    }
    const codes = alertType.alertCodes.map(at => {
      return {
        value: at.code,
        text: at.code,
        hint: { text: at.description },
      }
    })
    return res.render('pages/deactivateAlertCode/alertCodes', { alertType, codes })
  }
}
