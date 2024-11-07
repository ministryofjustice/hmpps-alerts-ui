import { Request, Response } from 'express'
import { SchemaType } from './schemas'

export default class EnterAlertReasonController {
  GET = async (req: Request, res: Response) => {
    const description = res.locals.formResponses?.['description'] ?? req.journeyData.bulkAlert!.description

    res.render('bulk-alerts/enter-alert-reason/view', {
      description,
      backUrl: '../bulk-alerts',
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    req.journeyData.bulkAlert!.description = req.body.description
    res.redirect('bulk-alerts/how-to-add-prisoners')
  }
}
