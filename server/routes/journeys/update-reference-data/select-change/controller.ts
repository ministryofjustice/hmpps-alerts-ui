import { Request, Response } from 'express'
import { SchemaType } from './schemas'

export default class SelectChangeController {
  GET = async (req: Request, res: Response) => {
    res.render('update-reference-data/select-change/view', {
      referenceDataType: req.journeyData.updateRefData!.referenceDataType,
      changeType: req.journeyData.updateRefData!.changeType,
      backUrl: '../update-reference-data',
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    req.journeyData.updateRefData!.changeType = req.body.changeType

    if (
      req.journeyData.updateRefData!.referenceDataType === 'ALERT_TYPE' &&
      req.journeyData.updateRefData!.changeType === 'ADD_NEW'
    ) {
      res.redirect('add-alert-type')
    } else {
      res.redirect('select-alert-type')
    }
  }
}
