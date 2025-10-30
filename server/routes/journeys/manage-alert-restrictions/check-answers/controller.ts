import { NextFunction, Request, Response } from 'express'
import BaseController from '../../../common/controller'
import AlertsApiClient from '../../../../data/alertsApiClient'
import AuditService from '../../../../services/auditService'
import { ManageAlertRestrictionsJourney } from '../../../../@types/express'

export default class ManageAlertRestrictionsCheckAnswersController extends BaseController {
  constructor(
    override alertsApiService: AlertsApiClient,
    readonly auditService: AuditService,
  ) {
    super(alertsApiService)
  }

  private getBackUrl = (journey: ManageAlertRestrictionsJourney) => {
    switch (journey.changeType) {
      case 'ADD_PRIVILEGED_USER':
      case 'REMOVE_PRIVILEGED_USER':
        return 'select-user'
      default:
        return 'select-alert-code'
    }
  }

  GET = async (req: Request, res: Response) => {
    req.journeyData.isCheckAnswers = true

    res.render('manage-alert-restrictions/check-answers/view', {
      journey: req.journeyData.restrictAlert,
      backUrl: this.getBackUrl(req.journeyData.restrictAlert!),
    })
  }

  checkSubmitToAPI = async (req: Request, res: Response, next: NextFunction) => {
    const journey = req.journeyData.restrictAlert!
    try {
      await this.auditService.logModificationApiCall(
        'ATTEMPT',
        'UPDATE',
        req.originalUrl,
        req.journeyData,
        res.locals.auditEvent,
      )

      switch (journey.changeType) {
        case 'RESTRICT_ALERT':
          await this.alertsApiService.restrictAlertCode(req.middleware.clientToken, journey.alertCode!.code)
          break
        case 'REMOVE_ALERT_RESTRICTION':
          await this.alertsApiService.removeRestrictionsForAlertCode(
            req.middleware.clientToken,
            journey.alertCode!.code,
          )
          break
        case 'ADD_PRIVILEGED_USER':
          await this.alertsApiService.addPrivilegedUser(
            req.middleware.clientToken,
            journey.alertCode!.code,
            journey.username!,
          )
          break
        case 'REMOVE_PRIVILEGED_USER':
          await this.alertsApiService.removePrivilegedUser(
            req.middleware.clientToken,
            journey.alertCode!.code,
            journey.username!,
          )
          break
        default:
          break
      }

      await this.auditService.logModificationApiCall(
        'SUCCESS',
        'UPDATE',
        req.originalUrl,
        req.journeyData,
        res.locals.auditEvent,
      )
      req.journeyData.journeyCompleted = true
      next()
    } catch (e) {
      next(e)
    }
  }

  POST = (_req: Request, res: Response) => {
    res.redirect('confirmation')
  }
}
