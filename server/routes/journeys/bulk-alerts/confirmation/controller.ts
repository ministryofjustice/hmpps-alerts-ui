import { Request, Response } from 'express'

export default class BulkAlertsConfirmationController {
  GET = async (req: Request, res: Response) => {
    res.render('bulk-alerts/confirmation/view', {
      ...req.journeyData.bulkAlert!.result,
      alertCode: req.journeyData.bulkAlert!.alertCode,
    })
  }
}
