import { Request, Response } from 'express'
import BaseController from '../../../common/controller'

export default class BulkAlertsCheckAnswersController extends BaseController {
  GET = async (req: Request, res: Response) => {
    req.journeyData.isCheckAnswers = true

    const { alertCode, description, prisonersSelected, cleanupMode } = req.journeyData.bulkAlert!

    const plan = await this.alertsApiService.planBulkAlerts(req.middleware.clientToken, {
      alertCode: alertCode!.code,
      ...(alertCode!.code === 'DOCGM' ? {} : { description: description! }),
      prisonNumbers: prisonersSelected!.map(prisoner => prisoner.prisonerNumber),
      cleanupMode: cleanupMode!,
    })

    res.render('bulk-alerts/check-answers/view', {
      plan,
      ...req.journeyData.bulkAlert,
    })
  }

  POST = (_req: Request, res: Response) => {
    res.redirect('confirmation')
  }
}
