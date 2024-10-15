import { Request, RequestHandler } from 'express'
import AlertsApiClient from '../../../data/alertsApiClient'
import { CreateAlertTypeRequestSchema } from '../../../@schemas/AlertTypeRequests'

export default class CreateAlertTypeRoutes {
  constructor(private readonly alertsApiClient: AlertsApiClient) {}

  public startPage: RequestHandler = async (req, res): Promise<void> => {
    const { alertTypeCode, alertTypeDescription } = req.session
    return res.render('pages/createAlertType/index', { alertTypeCode, alertTypeDescription })
  }

  public submitAlertType: RequestHandler = async (req, res): Promise<void> => {
    const { alertTypeCode, alertTypeDescription } = req.body
    const validationMessages = this.validationMessages(req)
    if (validationMessages.alertTypeCodeErrorMessage || validationMessages.alertTypeDescriptionErrorMessage) {
      return res.render('pages/createAlertType/index', validationMessages)
    }
    req.session.alertTypeCode = alertTypeCode
    req.session.alertTypeDescription = alertTypeDescription
    return res.redirect('/alert-type/confirmation')
  }

  public loadConfirmation: RequestHandler = async (req, res): Promise<void> => {
    const { alertTypeCode, alertTypeDescription } = req.session
    return res.render('pages/createAlertType/confirmation', { alertTypeCode, alertTypeDescription })
  }

  public submitConfirmation: RequestHandler = async (_req, res): Promise<void> => {
    return res.redirect('/alert-type/success')
  }

  public loadSuccess: RequestHandler = async (req, res): Promise<void> => {
    const { alertTypeCode, alertTypeDescription } = req.session
    const response = await this.alertsApiClient
      .createAlertType(req.middleware.clientToken, {
        code: alertTypeCode!,
        description: alertTypeDescription!,
      })
      .catch(err => {
        const alertTypeCodeErrorMessage = `Alert type with code '${alertTypeCode}' already exists`
        switch (err.data.status) {
          case 409:
            return res.render('pages/createAlertType/index', {
              alertTypeCodeErrorMessage,
              alertTypeCode,
              alertTypeDescription,
            })
          default:
            req.session.errorMessage = 'Your alert type was not created'
            return res.redirect('/error-page')
        }
      })
    return res.render('pages/createAlertType/success', { alertTypeCode, alertTypeDescription, response })
  }

  private validationMessages(req: Request) {
    const { alertTypeCode, alertTypeDescription, parent } = req.body

    const schemaCheck = CreateAlertTypeRequestSchema.safeParse({
      code: alertTypeCode,
      description: alertTypeDescription,
      parent,
    })
    if (schemaCheck.success) {
      return { alertTypeCode: schemaCheck.data.code, alertTypeDescription: schemaCheck.data.description }
    }
    const errors = schemaCheck.error.flatten().fieldErrors
    return {
      alertTypeCode,
      alertTypeDescription,
      alertTypeCodeErrorMessage: errors.code?.[0],
      alertTypeDescriptionErrorMessage: errors.description?.[0],
    }
  }
}
