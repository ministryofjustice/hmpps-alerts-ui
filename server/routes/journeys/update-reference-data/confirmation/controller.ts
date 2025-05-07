import { Request, Response } from 'express'

export default class UpdateReferenceDataConfirmationController {
  GET = async (req: Request, res: Response) => {
    const journey = req.journeyData.updateRefData!
    req.journeyData.journeyCompleted = true

    res.render('update-reference-data/confirmation/view', {
      journey,
    })
  }
}
