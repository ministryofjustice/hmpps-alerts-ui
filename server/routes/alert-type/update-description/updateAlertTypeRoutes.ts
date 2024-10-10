import { Request, RequestHandler } from 'express'
import AlertsApiClient from '../../../data/alertsApiClient'
import { UpdateAlertTypeRequestSchema } from '../../../@schemas/AlertTypeRequests'

export default class UpdateAlertTypeRoutes {
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
    req.session.updateAlertTypeCode = alertType
    return res.redirect('/alert-type/update-description/submit-description')
  }

  public loadSubmitDescription: RequestHandler = async (req, res): Promise<void> => {
    const alertType = await this.getAlertTypeDetails(req)
    const { code, description } = alertType
    return res.render('pages/updateAlertType/submitDescription', { code, description })
  }

  public saveSubmitDescription: RequestHandler = async (req, res): Promise<void> => {
    const { descriptionEntry } = req.body
    const validationMessages = this.validationMessages(req)
    if (validationMessages.alertTypeDescriptionErrorMessage) {
      const { code } = await this.getAlertTypeDetails(req)
      return res.render('pages/updateAlertType/submitDescription', {
        ...validationMessages,
        code,
      })
    }
    req.session.alertTypeDescription = descriptionEntry
    return res.redirect('/alert-type/update-description/confirmation')
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
    const { updateAlertTypeCode, alertTypeDescription } = req.session
    return res.render('pages/updateAlertType/confirmation', {
      code: updateAlertTypeCode,
      description: alertTypeDescription,
    })
  }

  public submitConfirmationPage: RequestHandler = async (req, res): Promise<void> => {
    const { confirmation } = req.body
    const { updateAlertTypeCode, alertTypeDescription } = req.session

    switch (confirmation) {
      case 'no':
        return res.redirect('/')
      case 'yes':
        return res.redirect('/alert-type/update-description/success')
      default:
        return res.render('pages/updateAlertType/confirmation', {
          code: updateAlertTypeCode,
          description: alertTypeDescription,
          confirmationErrorMessage: 'You must select either Yes or No.',
        })
    }
  }

  public loadSuccess: RequestHandler = async (req, res): Promise<void> => {
    const { updateAlertTypeCode, alertTypeDescription } = req.session

    return this.alertsApiClient
      .updateAlertType(req.middleware.clientToken, updateAlertTypeCode, { description: alertTypeDescription })
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
  }

  private getAlertTypeDetails = async (req: Request) => {
    const { updateAlertTypeCode } = req.session
    return (await this.alertsApiClient.retrieveAlertTypes(req.middleware.clientToken)).find(
      at => at.code === updateAlertTypeCode && at.isActive,
    )
  }
}
