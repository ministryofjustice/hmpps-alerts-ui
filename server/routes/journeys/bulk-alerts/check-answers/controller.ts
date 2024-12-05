import { NextFunction, Request, Response } from 'express'
import BaseController from '../../../common/controller'
import { sleep } from '../../../../utils/utils'

export default class BulkAlertsCheckAnswersController extends BaseController {
  GET = async (req: Request, res: Response) => {
    const { alertCode, description, cleanupMode } = req.journeyData.bulkAlert!

    await this.alertsApiService.patchBulkAlertsPlan(req.middleware.clientToken, req.journeyData.bulkAlert!.planId!, {
      alertCode: alertCode!.code,
      ...(alertCode!.code === 'DOCGM' ? {} : { description: description! }),
      cleanupMode: cleanupMode!,
    })

    const plan = (
      await this.alertsApiService.getBulkAlertsPlan(req.middleware.clientToken, req.journeyData.bulkAlert!.planId!)
    ).counts

    req.journeyData.isCheckAnswers = true
    delete req.journeyData.bulkAlert!.alertCodeSubJourney

    res.render('bulk-alerts/check-answers/view', {
      plan,
      prisonersSelectedCount: req.journeyData.bulkAlert!.prisonersSelectedCount,
      ...req.journeyData.bulkAlert,
    })
  }

  checkSubmitToAPI = async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const startTime = new Date().getTime()
      await this.alertsApiService.startBulkAlertsPlan(req.middleware.clientToken, req.journeyData.bulkAlert!.planId!)
      const token = req.middleware.clientToken
      const planId = req.journeyData.bulkAlert!.planId!
      let status
      for (;;) {
        if (new Date().getTime() - startTime > 5 * 60 * 1000) {
          return next(`Time out waiting for Bulk Alerts creation for planUuid: ${planId}`)
        }
        // eslint-disable-next-line no-await-in-loop
        status = await this.alertsApiService.getResultFromBulkAlertsPlan(token, planId)
        if (status.completedAt) {
          req.journeyData.bulkAlert!.result = status.counts
          req.journeyData.journeyCompleted = true
          return next()
        }
        // eslint-disable-next-line no-await-in-loop
        await sleep(1)
      }
    } catch (e) {
      return next(e)
    }
  }

  POST = (_req: Request, res: Response) => {
    res.redirect('confirmation')
  }
}
