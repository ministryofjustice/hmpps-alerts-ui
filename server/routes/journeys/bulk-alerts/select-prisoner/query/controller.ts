import { Request, Response } from 'express'
import { SchemaType } from './schemas'

export default class SelectPrisonerQueryController {
  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    req.journeyData.bulkAlert!.query = req.body.query
    res.redirect('../select-prisoner')
  }
}
