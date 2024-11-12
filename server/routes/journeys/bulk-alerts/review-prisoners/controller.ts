import { Request, Response } from 'express'

export default class ReviewPrisonersController {
  GET = async (req: Request, res: Response) => {
    const { remove } = req.query
    if (remove) {
      req.journeyData.bulkAlert!.prisonersSelected = req.journeyData.bulkAlert!.prisonersSelected!.filter(
        prisoner => prisoner.prisonerNumber !== remove,
      )
      return res.redirect('review-prisoners')
    }

    return res.render('bulk-alerts/review-prisoners/view', {
      prisonersSelected: req.journeyData.bulkAlert!.prisonersSelected,
      alertCode: req.journeyData.bulkAlert!.alertCode,
      backUrl: 'how-to-add-prisoners',
    })
  }

  POST = (req: Request, res: Response) => {
    res.redirect(
      req.journeyData.bulkAlert!.prisonersSelected!.length === 0 ? 'how-to-add-prisoners' : 'select-upload-logic',
    )
  }
}
