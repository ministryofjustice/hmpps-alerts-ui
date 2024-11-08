import { Request, Response } from 'express'
import { SchemaType } from './schemas'

export default class HowToAddPrisonersController {
  GET = async (req: Request, res: Response) => {
    const useCsvUpload = res.locals.formResponses?.['useCsvUpload'] ?? String(req.journeyData.bulkAlert!.useCsvUpload)

    res.render('bulk-alerts/how-to-add-prisoners/view', {
      useCsvUpload,
      backUrl: req.journeyData.bulkAlert!.alertCode!.code === 'DOCGM' ? '../bulk-alerts' : 'enter-alert-reason',
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    req.journeyData.bulkAlert!.useCsvUpload = req.body.useCsvUpload
    res.redirect(req.journeyData.bulkAlert!.useCsvUpload ? 'upload-prisoner-list' : 'select-prisoner')
  }
}
