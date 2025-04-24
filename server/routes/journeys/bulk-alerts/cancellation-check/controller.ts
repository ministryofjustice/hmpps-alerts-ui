import { Request, Response } from 'express'

export default class BulkAlertsCancellationCheckController {
  GET = async (_req: Request, res: Response) => {
    res.render('bulk-alerts/cancellation-check/view')
  }

  POST = (_req: Request, res: Response) => {
    res.redirect('/')
  }
}
