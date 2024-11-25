import { Request, Response } from 'express'

export default class BulkAlertsConfirmationController {
  GET = async (req: Request, res: Response) => {
    const { result, alertCode } = req.journeyData.bulkAlert!

    // delete unnecessary properties to reduce session storage size
    req.journeyData.bulkAlert = { result: result!, alertCode: alertCode! }

    res.render('bulk-alerts/confirmation/view', {
      ...result,
      alertCode,
    })
  }
}
