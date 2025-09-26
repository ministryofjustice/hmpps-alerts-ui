import { Request, Response } from 'express'
import { SchemaType } from './schemas'

export default class EditAlertTypeController {
  GET = async (req: Request, res: Response) => {
    res.render('update-reference-data/edit-alert-type/view', {
      description:
        res.locals.formResponses?.description ??
        req.journeyData.updateRefData!.description ??
        req.journeyData.updateRefData!.alertType?.description,
      backUrl: 'select-alert-type',
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    req.journeyData.updateRefData!.description = req.body.description
    res.redirect('check-answers')
  }
}
