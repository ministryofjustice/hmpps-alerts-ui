import { Request, RequestHandler } from 'express'
import AlertsApiClient from '../../../../data/alertsApiClient'
import { CreateAlertCodeRequestSchema } from '../../../../@schemas/AlertCodeRequests'
import AuditService from '../../../../services/auditService'

export default class CreateAlertCodeRoutes {
  constructor(
    private readonly alertsApiClient: AlertsApiClient,
    readonly auditService: AuditService,
  ) {}

  public startPage: RequestHandler = async (req, res): Promise<void> => {
    req.journeyData.refData ??= {}
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
    req.journeyData.refData!.alertCodeParentType = req.body.alertType
    return res.redirect('alert-code')
  }

  public loadAlertCode: RequestHandler = async (req, res): Promise<void> => {
    const { alertCode, alertDescription, alertCodeParentType } = req.journeyData.refData!
    return res.render('pages/createAlertCode/alertCode', { alertCode, alertDescription, alertCodeParentType })
  }

  public submitAlertCode: RequestHandler = async (req, res): Promise<void> => {
    const { alertCode, alertDescription } = req.body
    const validationMessages = this.validationMessages(req)
    if (validationMessages.alertCodeErrorMessage || validationMessages.alertDescriptionErrorMessage) {
      return res.render('pages/createAlertCode/alertCode', validationMessages)
    }
    req.journeyData.refData!.alertCode = alertCode
    req.journeyData.refData!.alertDescription = alertDescription
    return res.redirect('confirmation')
  }

  public loadConfirmation: RequestHandler = async (req, res): Promise<void> => {
    const { alertCode, alertDescription, alertCodeParentType } = req.journeyData.refData!
    return res.render('pages/createAlertCode/confirmation', { alertCode, alertDescription, alertCodeParentType })
  }

  public submitConfirmation: RequestHandler = async (_req, res): Promise<void> => {
    return res.redirect('success')
  }

  public loadSuccess: RequestHandler = async (req, res, next): Promise<void> => {
    const { alertCode, alertDescription, alertCodeParentType } = req.journeyData.refData!
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
    this.alertsApiClient
      .createAlertCode(req.middleware.clientToken, {
        code: alertCode!,
        description: alertDescription!,
        parent: alertCodeParentType!,
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
    try {
      await this.auditService.logModificationApiCall(
        'SUCCESS',
        'CREATE',
        req.originalUrl,
        req.journeyData,
        res.locals.auditEvent,
      )
    } catch (e: unknown) {
      next(e)
    }
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
