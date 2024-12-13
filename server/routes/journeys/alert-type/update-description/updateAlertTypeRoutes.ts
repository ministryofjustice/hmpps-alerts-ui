import { Request, RequestHandler } from 'express'
import AlertsApiClient from '../../../../data/alertsApiClient'
import { UpdateAlertTypeRequestSchema } from '../../../../@schemas/AlertTypeRequests'
import AuditService from '../../../../services/auditService'

export default class UpdateAlertTypeRoutes {
  constructor(
    private readonly alertsApiClient: AlertsApiClient,
    readonly auditService: AuditService,
  ) {}

  public startPage: RequestHandler = async (req, res): Promise<void> => {
    req.journeyData.refData ??= {}
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
    req.journeyData.refData!.updateAlertTypeCode = alertType
    return res.redirect('update-description/submit-description')
  }

  public loadSubmitDescription: RequestHandler = async (req, res): Promise<void> => {
    const alertType = await this.getAlertTypeDetails(req)
    const { code, description } = alertType!
    return res.render('pages/updateAlertType/submitDescription', { code, description })
  }

  public saveSubmitDescription: RequestHandler = async (req, res): Promise<void> => {
    const { descriptionEntry } = req.body
    const validationMessages = this.validationMessages(req)
    if (validationMessages.alertTypeDescriptionErrorMessage) {
      const { code } = (await this.getAlertTypeDetails(req))!
      return res.render('pages/updateAlertType/submitDescription', {
        ...validationMessages,
        code,
      })
    }
    req.journeyData.refData!.alertTypeDescription = descriptionEntry
    return res.redirect('confirmation')
  }

  private validationMessages(req: Request) {
    const { descriptionEntry } = req.body

    const schemaCheck = UpdateAlertTypeRequestSchema.safeParse({
      description: descriptionEntry,
    })
    if (schemaCheck.success) {
      return { description: schemaCheck.data.description }
    }
    const errors = schemaCheck.error.flatten().fieldErrors
    return { description: descriptionEntry, alertTypeDescriptionErrorMessage: errors.description?.[0] }
  }

  public loadConfirmation: RequestHandler = async (req, res): Promise<void> => {
    const { updateAlertTypeCode, alertTypeDescription } = req.journeyData.refData!
    return res.render('pages/updateAlertType/confirmation', {
      code: updateAlertTypeCode,
      description: alertTypeDescription,
    })
  }

  public submitConfirmationPage: RequestHandler = async (req, res): Promise<void> => {
    const { confirmation } = req.body
    const { updateAlertTypeCode, alertTypeDescription } = req.journeyData.refData!

    switch (confirmation) {
      case 'no':
        return res.redirect('/')
      case 'yes':
        return res.redirect('success')
      default:
        return res.render('pages/updateAlertType/confirmation', {
          code: updateAlertTypeCode,
          description: alertTypeDescription,
          confirmationErrorMessage: 'You must select either Yes or No.',
        })
    }
  }

  public loadSuccess: RequestHandler = async (req, res, next): Promise<void> => {
    const { updateAlertTypeCode, alertTypeDescription } = req.journeyData.refData!

    try {
      await this.auditService.logModificationApiCall(
        'ATTEMPT',
        'UPDATE',
        req.originalUrl,
        req.journeyData,
        res.locals.auditEvent,
      )
    } catch (e: unknown) {
      next(e)
    }
    await this.alertsApiClient
      .updateAlertType(req.middleware.clientToken, updateAlertTypeCode!, { description: alertTypeDescription! })
      .then(alertType => {
        return res.render('pages/updateAlertType/success', {
          code: alertType.code,
          description: alertType.description,
        })
      })
      .catch(_ => {
        req.session.errorMessage = 'Your alert type was not updated'
        return res.redirect('/error-page')
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
  }

  private getAlertTypeDetails = async (req: Request) => {
    const { updateAlertTypeCode } = req.journeyData.refData!
    return (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken)).find(
      at => at.code === updateAlertTypeCode && at.isActive,
    )
  }
}
