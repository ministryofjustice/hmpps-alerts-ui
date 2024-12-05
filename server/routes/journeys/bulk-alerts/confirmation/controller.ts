import { Request, Response } from 'express'

export default class BulkAlertsConfirmationController {
  GET = async (req: Request, res: Response) => {
    const { result, alertCode } = req.journeyData.bulkAlert!
    req.journeyData.journeyCompleted = true

    res.render('bulk-alerts/confirmation/view', {
      result,
      alertCode,
    })
  }
}
