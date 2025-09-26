import { Request, Response } from 'express'
import { SchemaType } from './schemas'

export default class SelectUploadLogicController {
  GET = async (req: Request, res: Response) => {
    const cleanupMode = res.locals.formResponses?.cleanupMode ?? req.journeyData.bulkAlert!.cleanupMode

    res.render('bulk-alerts/select-upload-logic/view', {
      cleanupMode,
      alertCode: req.journeyData.bulkAlert!.alertCode,
      backUrl: 'review-prisoners',
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    req.journeyData.bulkAlert!.cleanupMode = req.body.cleanupMode
    res.redirect('check-answers')
  }
}
