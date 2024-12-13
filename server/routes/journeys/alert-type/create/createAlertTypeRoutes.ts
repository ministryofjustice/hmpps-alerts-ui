import { Request, RequestHandler } from 'express'
import AlertsApiClient from '../../../../data/alertsApiClient'
import { CreateAlertTypeRequestSchema } from '../../../../@schemas/AlertTypeRequests'
import AuditService from '../../../../services/auditService'

export default class CreateAlertTypeRoutes {
  constructor(
    private readonly alertsApiClient: AlertsApiClient,
    readonly auditService: AuditService,
  ) {}

  public startPage: RequestHandler = async (req, res): Promise<void> => {
    req.journeyData.refData ??= {}
    const { alertTypeCode, alertTypeDescription } = req.journeyData.refData!
    return res.render('pages/createAlertType/index', { alertTypeCode, alertTypeDescription })
  }

  public submitAlertType: RequestHandler = async (req, res): Promise<void> => {
    const { alertTypeCode, alertTypeDescription } = req.body
    const validationMessages = this.validationMessages(req)
    if (validationMessages.alertTypeCodeErrorMessage || validationMessages.alertTypeDescriptionErrorMessage) {
      return res.render('pages/createAlertType/index', validationMessages)
    }
    req.journeyData.refData!.alertTypeCode = alertTypeCode
    req.journeyData.refData!.alertTypeDescription = alertTypeDescription
    return res.redirect('confirmation')
  }

  public loadConfirmation: RequestHandler = async (req, res): Promise<void> => {
    const { alertTypeCode, alertTypeDescription } = req.journeyData.refData!
    return res.render('pages/createAlertType/confirmation', { alertTypeCode, alertTypeDescription })
  }

  public submitConfirmation: RequestHandler = async (_req, res): Promise<void> => {
    return res.redirect('success')
  }

  public loadSuccess: RequestHandler = async (req, res, next): Promise<void> => {
    const { alertTypeCode, alertTypeDescription } = req.journeyData.refData!
    try {
      await this.auditService.logModificationApiCall(
        'ATTEMPT',
        'CREATE',
        req.originalUrl,
        req.journeyData,
        res.locals.auditEvent,
      )
    } catch (e: unknown) {
      next(e)
    }
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
    try {
      await this.auditService.logModificationApiCall(
        'SUCCESS',
        'UPDATE',
        req.originalUrl,
        req.journeyData,
        res.locals.auditEvent,
      )
    } catch (e: unknown) {
      next(e)
    }
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
