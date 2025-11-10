import { NextFunction, Request, Response } from 'express'
import BaseController from '../common/controller'
import { FLASH_KEY__SUCCESS_MESSAGE } from '../../utils/constants'
import { SchemaType } from './schemas'
import AlertsApiClient from '../../data/alertsApiClient'
import AuditService from '../../services/auditService'

export default class DeleteAlertController extends BaseController {
  constructor(
    override alertsApiService: AlertsApiClient,
    readonly auditService: AuditService,
  ) {
    super(alertsApiService)
  }

  GET = async (req: Request, res: Response) => {
    const alertUuid = res.locals.formResponses?.alertUuid
    if (alertUuid) {
      res.locals.auditEvent.subjectId = alertUuid
      res.locals.auditEvent.subjectType = alertUuid
    }
    res.render('delete-alert/view', {
      successMessage: req.flash(FLASH_KEY__SUCCESS_MESSAGE)[0],
      alertUuid,
    })
  }

  checkSubmitToAPI = async (req: Request<unknown, unknown, SchemaType>, res: Response, next: NextFunction) => {
    try {
      await this.auditService.logModificationApiCall(
        'ATTEMPT',
        'DELETE',
        req.originalUrl,
        req.journeyData,
        res.locals.auditEvent,
      )
      const { alertUuid } = req.body
      await this.alertsApiService.deleteAlert(req.middleware.clientToken, alertUuid)
      req.flash(FLASH_KEY__SUCCESS_MESSAGE, `Deleted alert ${req.body.alertUuid}`)
      await this.auditService.logModificationApiCall(
        'SUCCESS',
        'DELETE',
        req.originalUrl,
        req.journeyData,
        res.locals.auditEvent,
      )
      next()
    } catch (e) {
      next(e)
    }
  }

  POST = (_req: Request<unknown, unknown, SchemaType>, res: Response) => {
    res.redirect('/delete-alert')
  }
}
