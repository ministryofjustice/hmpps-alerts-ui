import { Request, Response } from 'express'
import { SchemaType } from './schemas'

const basePath = 'manage-alert-restrictions'

export default class ManageAlertRestrictionsController {
  GET = async (req: Request, res: Response) => {
    req.journeyData.restrictAlert ??= {}
    res.render('manage-alert-restrictions/view', {
      changeType: req.journeyData.restrictAlert!.changeType,
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    const { changeType } = req.body
    req.journeyData.restrictAlert!.changeType = changeType

    res.redirect(`${basePath}/select-alert-type`)
  }
}
