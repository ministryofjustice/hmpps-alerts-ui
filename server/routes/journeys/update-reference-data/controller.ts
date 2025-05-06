import { Request, Response } from 'express'
import { SchemaType } from './schemas'

export default class UpdateReferenceDataController {
  GET = async (req: Request, res: Response) => {
    req.journeyData.updateRefData ??= {}
    res.render('update-reference-data/view', {
      referenceDataType: req.journeyData.updateRefData.referenceDataType,
      backUrl: req.journeyData.isCheckAnswers ? 'update-reference-data/check-answers' : '/',
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    req.journeyData.updateRefData!.referenceDataType = req.body.referenceDataType
    return res.redirect('update-reference-data/select-change')
  }
}
