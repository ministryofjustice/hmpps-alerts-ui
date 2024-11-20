import { NextFunction, Request, Response } from 'express'
import BaseController from '../../../common/controller'

export default class BulkAlertsCheckAnswersController extends BaseController {
  GET = async (req: Request, res: Response) => {
    req.journeyData.isCheckAnswers = true
    delete req.journeyData.bulkAlert!.alertCodeSubJourney

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

  checkSubmitToAPI = async (req: Request, _res: Response, next: NextFunction) => {
    const { alertCode, description, prisonersSelected, cleanupMode } = req.journeyData.bulkAlert!
    try {
      req.journeyData.bulkAlert!.result = await this.alertsApiService.createBulkAlerts(req.middleware.clientToken, {
        alertCode: alertCode!.code,
        ...(alertCode!.code === 'DOCGM' ? {} : { description: description! }),
        prisonNumbers: prisonersSelected!.map(prisoner => prisoner.prisonerNumber),
        cleanupMode: cleanupMode!,
      })
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
