import { NextFunction, Request, Response } from 'express'
import BaseController from '../../common/controller'
import { SchemaType } from './schemas'
import AlertsApiClient from '../../../data/alertsApiClient'
import AuditService from '../../../services/auditService'

export default class BulkAlertsController extends BaseController {
  constructor(
    override alertsApiService: AlertsApiClient,
    readonly auditService: AuditService,
  ) {
    super(alertsApiService)
  }

  GET = async (req: Request, res: Response) => {
    req.journeyData.bulkAlert ??= {}
    const alertType =
      res.locals.formResponses?.alertType ??
      req.journeyData.bulkAlert.alertCodeSubJourney?.alertType?.code ??
      req.journeyData.bulkAlert.alertType?.code
    const alertCode =
      res.locals.formResponses?.alertCode ??
      req.journeyData.bulkAlert.alertCodeSubJourney?.alertCode?.code ??
      req.journeyData.bulkAlert.alertCode?.code

    const { alertTypes, alertCodes, typeCodeMap } = await this.mapAlertTypes({
      req,
      includeInactive: true,
      ...(alertType ? { type: alertType as string } : {}),
    })
    res.render('bulk-alerts/view', {
      alertType,
      alertCode,
      alertTypes,
      alertCodes,
      typeCodeMap,
      backUrl: req.journeyData.isCheckAnswers ? 'bulk-alerts/check-answers' : '/',
    })
  }

  START_BACKEND_SESSION = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.journeyData.bulkAlert!.planId) {
      await this.auditService.logModificationApiCall(
        'ATTEMPT',
        'CREATE',
        req.originalUrl,
        req.journeyData,
        res.locals.auditEvent,
      )
      const { id: planId } = await this.alertsApiService.createBulkAlertsPlan(req.middleware.clientToken)
      req.journeyData.bulkAlert!.planId = planId
      await this.auditService.logModificationApiCall(
        'SUCCESS',
        'CREATE',
        req.originalUrl,
        req.journeyData,
        res.locals.auditEvent,
      )
    }
    next()
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    if (
      req.journeyData.isCheckAnswers &&
      (req.body.alertCode.code === 'DOCGM' || req.journeyData.bulkAlert!.description !== undefined)
    ) {
      req.journeyData.bulkAlert!.alertType = req.body.alertType
      req.journeyData.bulkAlert!.alertCode = req.body.alertCode
      return res.redirect('bulk-alerts/check-answers')
    }

    if (req.body.alertCode.code === 'DOCGM') {
      req.journeyData.bulkAlert!.alertType = req.body.alertType
      req.journeyData.bulkAlert!.alertCode = req.body.alertCode
      return res.redirect('bulk-alerts/how-to-add-prisoners')
    }

    req.journeyData.bulkAlert!.alertCodeSubJourney = {
      alertType: req.body.alertType,
      alertCode: req.body.alertCode,
    }
    return res.redirect('bulk-alerts/enter-alert-reason')
  }
}
