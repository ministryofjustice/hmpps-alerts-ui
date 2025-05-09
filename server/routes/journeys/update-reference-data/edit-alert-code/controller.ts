import { Request, Response } from 'express'
import { SchemaType } from './schemas'

export default class EditAlertCodeController {
  GET = async (req: Request, res: Response) => {
    res.render('update-reference-data/edit-alert-code/view', {
      description:
        res.locals.formResponses?.['description'] ??
        req.journeyData.updateRefData!.description ??
        req.journeyData.updateRefData!.alertCode?.description,
      backUrl: 'select-alert-code',
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    req.journeyData.updateRefData!.description = req.body.description
    res.redirect('check-answers')
  }
}
