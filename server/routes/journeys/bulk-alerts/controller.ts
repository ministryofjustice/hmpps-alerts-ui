import { Request, Response } from 'express'
import BaseController from '../../common/controller'
import { SchemaType } from './schemas'

export default class BulkAlertsController extends BaseController {
  GET = async (req: Request, res: Response) => {
    req.journeyData.bulkAlert ??= {}
    const alertType = res.locals.formResponses?.['alertType'] ?? req.journeyData.bulkAlert.alertType?.code
    const alertCode = res.locals.formResponses?.['alertCode'] ?? req.journeyData.bulkAlert.alertCode?.code

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
      backUrl: '/',
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    req.journeyData.bulkAlert!.alertType = req.body.alertType
    req.journeyData.bulkAlert!.alertCode = req.body.alertCode
    if (req.body.alertCode.code === 'DOCGM') {
      res.redirect('bulk-alerts/how-to-add-prisoners')
    } else {
      res.redirect('bulk-alerts/enter-alert-reason')
    }
  }
}
