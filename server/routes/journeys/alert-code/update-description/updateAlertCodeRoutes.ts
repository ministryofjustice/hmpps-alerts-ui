import { Request, RequestHandler } from 'express'
import AlertsApiClient from '../../../../data/alertsApiClient'
import { UpdateAlertCodeRequestSchema } from '../../../../@schemas/AlertCodeRequests'
import AuditService from '../../../../services/auditService'

export default class UpdateAlertCodeRoutes {
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
    req.journeyData.refData!.alertCodeParentType = alertType
    return res.redirect('update-description/alert-code')
  }

  public loadSelectAlertCode: RequestHandler = async (req, res): Promise<void> => {
    const { alertType, codes } = await this.getAlertCode(req)
    if (!codes?.length) {
      req.session.errorMessage = `There are no codes associated with alert type ${alertType!.code}`
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
    req.journeyData.refData!.alertCode = alertCode
    return res.redirect('submit-description')
  }

  public loadSubmitDescription: RequestHandler = async (req, res): Promise<void> => {
    const { code, description } = (await this.getAlertCodeDetails(req))!
    return res.render('pages/updateAlertCode/submitDescription', { code, description })
  }

  public saveSubmitDescription: RequestHandler = async (req, res): Promise<void> => {
    const { descriptionEntry } = req.body
    const validationMessages = this.validationMessages(req)
    if (validationMessages.alertCodeDescriptionErrorMessage) {
      const { code } = (await this.getAlertCodeDetails(req))!
      return res.render('pages/updateAlertCode/submitDescription', {
        ...validationMessages,
        code,
      })
    }
    req.journeyData.refData!.alertDescription = descriptionEntry
    return res.redirect('confirmation')
  }

  private validationMessages(req: Request) {
    const { descriptionEntry } = req.body

    const schemaCheck = UpdateAlertCodeRequestSchema.safeParse({
      description: descriptionEntry,
    })
    if (schemaCheck.success) {
      return { description: descriptionEntry }
    }
    const errors = schemaCheck.error.flatten().fieldErrors
    return { description: descriptionEntry, alertCodeDescriptionErrorMessage: errors.description?.[0] }
  }

  public loadConfirmation: RequestHandler = async (req, res): Promise<void> => {
    const { alertCode, alertDescription } = req.journeyData.refData!
    return res.render('pages/updateAlertCode/confirmation', {
      code: alertCode,
      description: alertDescription,
    })
  }

  public submitConfirmationPage: RequestHandler = async (req, res): Promise<void> => {
    const { confirmation } = req.body
    const { alertCode, alertDescription } = req.journeyData.refData!

    switch (confirmation) {
      case 'no':
        return res.redirect('/')
      case 'yes':
        return res.redirect('success')
      default:
        return res.render('pages/updateAlertCode/confirmation', {
          code: alertCode,
          description: alertDescription,
          confirmationErrorMessage: 'You must select either Yes or No.',
        })
    }
  }

  public loadSuccess: RequestHandler = async (req, res, next): Promise<void> => {
    const { alertCode, alertDescription } = req.journeyData.refData!
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
      .updateAlertCode(req.middleware.clientToken, alertCode!, { description: alertDescription! })
      .then(ac => {
        return res.render('pages/updateAlertCode/success', {
          code: ac.code,
          description: ac.description,
        })
      })
      .catch(_ => {
        req.session.errorMessage = 'Your alert code was not updated'
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

  private getAlertCode = async (req: Request) => {
    const { alertCodeParentType } = req.journeyData.refData!
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
    const { alertCode, alertCodeParentType } = req.journeyData.refData!
    return (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken))
      .find(at => at.code === alertCodeParentType)
      ?.alertCodes.find(ac => ac.code === alertCode)
  }
}
