import { Request, Response } from 'express'
import { SchemaType } from './schemas'

export default class UploadPrisonerListController {
  GET = async (_req: Request, res: Response) => {
    res.render('bulk-alerts/upload-prisoner-list/view', {
      backUrl: 'how-to-add-prisoners',
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    req.journeyData.bulkAlert!.prisonersSelected ??= []
    req.journeyData.bulkAlert!.prisonersSelected = req.journeyData.bulkAlert!.prisonersSelected!.filter(
      prisoner => !req.body.prisonersUploaded.find(itm => itm.prisonerNumber === prisoner.prisonerNumber),
    )
    req.journeyData.bulkAlert!.prisonersSelected = req.journeyData.bulkAlert!.prisonersSelected!.concat(
      req.body.prisonersUploaded,
    )
    res.redirect('review-prisoners')
  }
}
