import { Request, RequestHandler } from 'express'
import AlertsApiClient from '../data/alertsApiClient'
import { CreateAlertCodeRequestSchema } from '../@schemas/AlertCodeRequests'

export default class CreateAlertCodeRoutes {
  constructor(private readonly alertsApiClient: AlertsApiClient) {}

  public startPage: RequestHandler = async (req, res): Promise<void> => {
    const alertTypes = (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken))
      .filter(alertType => alertType.isActive)
      .map(alertType => {
        return {
          value: alertType.code,
          text: alertType.code,
          hint: { text: alertType.description },
        }
      })
    return res.render('pages/createAlertCode/index', { alertTypes })
  }

  public submitAlertType: RequestHandler = async (req, res): Promise<void> => {
    if (this.isNullOrEmpty(req.body.alertType)) {
      const alertTypes = (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken))
        .filter(alertType => alertType.isActive)
        .map(alertType => {
          return {
            value: alertType.code,
            text: alertType.code,
            hint: { text: alertType.description },
          }
        })
      const alertTypeErrorMessage = 'An alert type must be selected'
      return res.render('pages/createAlertCode/index', { alertTypes, alertTypeErrorMessage })
    }
    req.session.alertCodeParentType = req.body.alertType
    return res.redirect('/alert-code/alert-code')
  }

  public loadAlertCode: RequestHandler = async (req, res): Promise<void> => {
    const { alertCode, alertDescription, alertCodeParentType } = req.session
    return res.render('pages/createAlertCode/alertCode', { alertCode, alertDescription, alertCodeParentType })
  }

  public submitAlertCode: RequestHandler = async (req, res): Promise<void> => {
    const { alertCode, alertDescription } = req.body
    const validationMessages = this.validationMessages(req)
    if (validationMessages.alertCodeErrorMessage || validationMessages.alertDescriptionErrorMessage) {
      return res.render('pages/createAlertCode/alertCode', validationMessages)
    }
    req.session.alertCode = alertCode
    req.session.alertDescription = alertDescription
    return res.redirect('/alert-code/confirmation')
  }

  public loadConfirmation: RequestHandler = async (req, res): Promise<void> => {
    const { alertCode, alertDescription, alertCodeParentType } = req.session
    return res.render('pages/createAlertCode/confirmation', { alertCode, alertDescription, alertCodeParentType })
  }

  public submitConfirmation: RequestHandler = async (req, res): Promise<void> => {
    return res.redirect('/alert-code/success')
  }

  public loadSuccess: RequestHandler = async (req, res): Promise<void> => {
    const { alertCode, alertDescription, alertCodeParentType } = req.session
    this.alertsApiClient
      .createAlertCode(req.middleware.clientToken, {
        code: alertCode,
        description: alertDescription,
        parent: alertCodeParentType,
      })
      .then(response => {
        return res.render('pages/createAlertCode/success', {
          alertCode,
          alertDescription,
          alertCodeParentType,
          response,
        })
      })
      .catch(err => {
        const alertCodeErrorMessage = `Alert code '${alertCode}' already exists`
        switch (err.status) {
          case 409:
            return res.render('pages/createAlertCode/alertCode', {
              alertCodeErrorMessage,
              alertCode,
              alertDescription,
              alertCodeParentType,
            })
          default:
            req.session.errorMessage = 'Your alert code was not created'
            return res.redirect('/error-page')
        }
      })
  }

  private isNullOrEmpty(value: string): boolean {
    return value === null || value === undefined || value === ''
  }

  private validationMessages(req: Request) {
    const { alertCode, alertDescription, parent } = req.body

    const schemaCheck = CreateAlertCodeRequestSchema.safeParse({
      code: alertCode,
      description: alertDescription,
      parent,
    })
    if (schemaCheck.success) {
      return { alertCode, alertDescription }
    }
    const errors = schemaCheck.error.flatten().fieldErrors
    return {
      alertCode,
      alertDescription,
      alertCodeErrorMessage: errors.code?.[0],
      alertDescriptionErrorMessage: errors.description?.[0],
    }
  }
}
