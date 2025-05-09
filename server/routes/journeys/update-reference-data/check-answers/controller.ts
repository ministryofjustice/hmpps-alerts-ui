import { NextFunction, Request, Response } from 'express'
import BaseController from '../../../common/controller'
import AlertsApiClient from '../../../../data/alertsApiClient'
import AuditService from '../../../../services/auditService'
import { UpdateReferenceDataJourney } from '../../../../@types/express'

export default class UpdateReferenceDataCheckAnswersController extends BaseController {
  constructor(
    override alertsApiService: AlertsApiClient,
    readonly auditService: AuditService,
  ) {
    super(alertsApiService)
  }

  private getBackUrl = (journey: UpdateReferenceDataJourney) => {
    if (journey.referenceDataType === 'ALERT_TYPE') {
      switch (journey.changeType) {
        case 'ADD_NEW':
          return 'add-alert-type'
        case 'EDIT_DESCRIPTION':
          return 'edit-alert-type'
        case 'DEACTIVATE':
        case 'REACTIVATE':
        default:
          return 'select-alert-type'
      }
    } else {
      switch (journey.changeType) {
        case 'ADD_NEW':
          return 'add-alert-code'
        case 'EDIT_DESCRIPTION':
          return 'edit-alert-code'
        case 'DEACTIVATE':
        case 'REACTIVATE':
        default:
          return 'select-alert-code'
      }
    }
  }

  GET = async (req: Request, res: Response) => {
    req.journeyData.isCheckAnswers = true
    delete req.journeyData.updateRefData!.updateAlertCodeSubJourney

    res.render('update-reference-data/check-answers/view', {
      journey: req.journeyData.updateRefData,
      backUrl: this.getBackUrl(req.journeyData.updateRefData!),
    })
  }

  checkSubmitToAPI = async (req: Request, res: Response, next: NextFunction) => {
    const journey = req.journeyData.updateRefData!
    try {
      await this.auditService.logModificationApiCall(
        'ATTEMPT',
        journey.changeType === 'ADD_NEW' ? 'CREATE' : 'UPDATE',
        req.originalUrl,
        req.journeyData,
        res.locals.auditEvent,
      )

      if (journey.referenceDataType === 'ALERT_TYPE') {
        switch (journey.changeType) {
          case 'ADD_NEW':
            await this.alertsApiService.createAlertType(req.middleware.clientToken, {
              code: journey.code!,
              description: journey.description!,
            })
            break
          case 'EDIT_DESCRIPTION':
          case 'DEACTIVATE':
          case 'REACTIVATE':
          default:
            break
        }
      } else {
        switch (journey.changeType) {
          case 'ADD_NEW':
            await this.alertsApiService.createAlertCode(req.middleware.clientToken, {
              code: journey.code!,
              description: journey.description!,
              parent: journey.alertType!.code!,
            })
            break
          case 'EDIT_DESCRIPTION':
            await this.alertsApiService.updateAlertCode(req.middleware.clientToken, journey.alertCode!.code, {
              description: journey.description!,
            })
            break
          case 'DEACTIVATE':
          case 'REACTIVATE':
            await this.alertsApiService.reactivateAlertCode(req.middleware.clientToken, journey.alertCode!.code)
            break
          default:
            break
        }
      }
      await this.auditService.logModificationApiCall(
        'SUCCESS',
        journey.changeType === 'ADD_NEW' ? 'CREATE' : 'UPDATE',
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
