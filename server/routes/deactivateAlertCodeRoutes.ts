import { Request, RequestHandler } from 'express'
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
    const { alertType, codes } = await this.getAlertDetails(req)
    if (codes === undefined || codes.length === 0) {
      req.session.errorMessage = `There are no codes associated with alert type ${alertType.code}`
      return res.redirect('/errorPage')
    }
    return res.render('pages/deactivateAlertCode/alertCodes', { alertType, codes })
  }

  private getAlertDetails = async (req: Request) => {
    const { deactivateAlertTypeCode } = req.session
    const alertType = (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken)).find(
      at => at.code === deactivateAlertTypeCode,
    )
    let codes
    if (alertType.alertCodes !== undefined && alertType.alertCodes.length !== 0) {
      codes = alertType.alertCodes.map(at => {
        return {
          value: at.code,
          text: at.code,
          hint: { text: at.description },
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
      return res.render('pages/deactivateAlertCode/alertCodes', { alertType, codes, alertCodeErrorMessage })
    }
    req.session.deactivateAlertCode = alertCode
    return res.redirect('/alertCode/deactivate/confirmation')
  }

  public loadConfirmationPage: RequestHandler = async (req, res): Promise<void> => {
    const { deactivateAlertCode } = req.session
    return res.render('pages/deactivateAlertCode/confirmation', { deactivateAlertCode })
  }
}
