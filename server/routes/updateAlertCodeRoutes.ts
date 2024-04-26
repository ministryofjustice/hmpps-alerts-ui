import { Request, RequestHandler } from 'express'
import AlertsApiClient from '../data/alertsApiClient'

export default class UpdateAlertCodeRoutes {
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
    return res.render('pages/updateAlertCode/index', { alertTypes })
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
      return res.render('pages/updateAlertCode/index', { alertTypes, alertTypeErrorMessage })
    }
    req.session.alertCodeParentType = alertType
    return res.redirect('/alert-code/update-description/alert-code')
  }

  public loadSelectAlertCode: RequestHandler = async (req, res): Promise<void> => {
    const { alertType, codes } = await this.getAlertCode(req)
    if (!codes?.length) {
      req.session.errorMessage = `There are no codes associated with alert type ${alertType.code}`
      return res.redirect('/error-page')
    }
    return res.render('pages/updateAlertCode/alertCode', { alertType, codes })
  }

  public saveSelectAlertCode: RequestHandler = async (req, res): Promise<void> => {
    const { alertCode } = req.body
    if (!alertCode?.length) {
      const { alertType, codes } = await this.getAlertCode(req)
      const alertCodeErrorMessage = 'An alert code must be selected'
      return res.render('pages/updateAlertCode/alertCode', { alertType, codes, alertCodeErrorMessage })
    }
    req.session.alertCode = alertCode
    return res.redirect('/alert-code/update-description/submit-description')
  }

  public loadSubmitDescription: RequestHandler = async (req, res): Promise<void> => {
    const { code, description } = await this.getAlertCodeDetails(req)
    return res.render('pages/updateAlertCode/submitDescription', { code, description })
  }

  public saveSubmitDescription: RequestHandler = async (req, res): Promise<void> => {
    const { descriptionEntry } = req.body
    if (!descriptionEntry || descriptionEntry.length === 0 || descriptionEntry > 40) {
      const { code } = await this.getAlertCodeDetails(req)
      return res.render('pages/updateAlertCode/submitDescription', {
        code,
        description: descriptionEntry,
        alertCodeDescriptionErrorMessage: 'An alert code description must be between 1 and 40 characters',
      })
    }
    req.session.alertDescription = descriptionEntry
    return res.redirect('/alert-code/update-description/confirmation')
  }

  public loadConfirmation: RequestHandler = async (req, res): Promise<void> => {
    const { alertCode, alertDescription } = req.session
    return res.render('pages/updateAlertCode/confirmation', {
      code: alertCode,
      description: alertDescription,
    })
  }

  public submitConfirmationPage: RequestHandler = async (req, res): Promise<void> => {
    const { confirmation } = req.body
    const { alertCode, alertDescription } = req.session

    switch (confirmation) {
      case 'no':
        return res.redirect('/')
      case 'yes':
        return res.redirect('/alert-code/update-description/success')
      default:
        return res.render('pages/updateAlertCode/confirmation', {
          code: alertCode,
          description: alertDescription,
          confirmationErrorMessage: 'You must select either Yes or No.',
        })
    }
  }

  public loadSuccess: RequestHandler = async (req, res): Promise<void> => {
    const { alertCode, alertDescription } = req.session
    return res.render('pages/updateAlertCode/success', {
      code: alertCode,
      description: alertDescription,
    })
  }

  private getAlertCode = async (req: Request) => {
    const { alertCodeParentType } = req.session
    const alertType = (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken)).find(
      at => at.code === alertCodeParentType && at.isActive,
    )
    let codes
    if (alertType?.alertCodes?.length) {
      codes = alertType.alertCodes
        .filter(ac => ac.isActive)
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

  private getAlertCodeDetails = async (req: Request) => {
    const { alertCode, alertCodeParentType } = req.session
    return (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken))
      .find(at => at.code === alertCodeParentType)
      ?.alertCodes.find(ac => ac.code === alertCode)
  }
}
