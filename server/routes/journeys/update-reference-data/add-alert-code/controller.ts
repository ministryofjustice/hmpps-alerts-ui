import { Request, Response } from 'express'
import { SchemaType } from './schemas'

export default class AddAlertCodeController {
  GET = async (req: Request, res: Response) => {
    res.render('update-reference-data/add-alert-code/view', {
      code: res.locals.formResponses?.code ?? req.journeyData.updateRefData!.code,
      description: res.locals.formResponses?.description ?? req.journeyData.updateRefData!.description,
      backUrl: 'select-alert-type',
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    req.journeyData.updateRefData!.code = req.body.code
    req.journeyData.updateRefData!.description = req.body.description
    res.redirect('check-answers')
  }
}
