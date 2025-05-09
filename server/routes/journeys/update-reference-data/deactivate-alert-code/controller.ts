import { NextFunction, Request, Response } from 'express'
import BaseController from '../../../common/controller'
import AlertsApiClient from '../../../../data/alertsApiClient'
import AuditService from '../../../../services/auditService'
import { SchemaType } from './schemas'

export default class DeactivateAlertCodeController extends BaseController {
  constructor(
    override alertsApiService: AlertsApiClient,
    readonly auditService: AuditService,
  ) {
    super(alertsApiService)
  }

  GET = async (req: Request, res: Response) => {
    res.render('update-reference-data/deactivate-alert-code/view', {
      alertCode: req.journeyData.updateRefData!.alertCode,
      backUrl: 'select-alert-code',
    })
  }

  POST = async (req: Request<unknown, unknown, SchemaType>, res: Response, next: NextFunction) => {
    if (req.body.confirm === 'YES') {
      const journey = req.journeyData.updateRefData!
      try {
        await this.auditService.logModificationApiCall(
          'ATTEMPT',
          'UPDATE',
          req.originalUrl,
          req.journeyData,
          res.locals.auditEvent,
        )

        await this.alertsApiService.deactivateAlertCode(req.middleware.clientToken, journey.alertCode!.code)

        await this.auditService.logModificationApiCall(
          'SUCCESS',
          'UPDATE',
          req.originalUrl,
          req.journeyData,
          res.locals.auditEvent,
        )
        req.journeyData.journeyCompleted = true
        res.redirect('confirmation')
      } catch (e) {
        next(e)
      }
    } else {
      res.redirect('/')
    }
  }
}
