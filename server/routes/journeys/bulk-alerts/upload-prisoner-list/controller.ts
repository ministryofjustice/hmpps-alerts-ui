import { Request, Response } from 'express'

export default class UploadPrisonerListController {
  GET = async (req: Request, res: Response) => {
    res.render('bulk-alerts/upload-prisoner-list/view', {
      backUrl: req.journeyData.isCheckAnswers ? 'review-prisoners' : 'how-to-add-prisoners',
    })
  }

  POST = (_req: Request, res: Response) => {
    res.redirect('review-prisoners')
  }
}
