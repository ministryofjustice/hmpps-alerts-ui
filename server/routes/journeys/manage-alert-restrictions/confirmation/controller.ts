import { Request, Response } from 'express'

export default class ManageAlertRestrictionConfirmationController {
  GET = async (req: Request, res: Response) => {
    const journey = req.journeyData.restrictAlert!
    req.journeyData.journeyCompleted = true

    res.render('manage-alert-restrictions/confirmation/view', {
      journey,
    })
  }
}
