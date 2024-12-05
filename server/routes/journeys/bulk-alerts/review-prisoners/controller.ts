import { Request, Response } from 'express'
import BaseController from '../../../common/controller'

export default class ReviewPrisonersController extends BaseController {
  GET = async (req: Request, res: Response) => {
    const { remove } = req.query
    if (remove) {
      await this.alertsApiService.removePrisonersFromBulkAlertsPlan(
        req.middleware.clientToken,
        req.journeyData.bulkAlert!.planId!,
        remove as string,
      )
      return res.redirect('review-prisoners')
    }

    const { prisoners: prisonersSelected } = await this.alertsApiService.getPrisonersFromBulkAlertsPlan(
      req.middleware.clientToken,
      req.journeyData.bulkAlert!.planId!,
    )
    req.journeyData.bulkAlert!.prisonersSelectedCount = prisonersSelected.length
    if (prisonersSelected.length === 0) {
      delete req.journeyData.isCheckAnswers
    }

    return res.render('bulk-alerts/review-prisoners/view', {
      prisonersSelected,
      alertCode: req.journeyData.bulkAlert!.alertCode,
      backUrl: 'how-to-add-prisoners',
    })
  }

  POST = (req: Request, res: Response) => {
    res.redirect(
      req.journeyData.bulkAlert!.prisonersSelectedCount === 0 ? 'how-to-add-prisoners' : 'select-upload-logic',
    )
  }
}
