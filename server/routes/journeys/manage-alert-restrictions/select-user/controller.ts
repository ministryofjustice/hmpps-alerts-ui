import { Request, Response } from 'express'
import { SchemaType } from './schemas'

export default class SelectUserController {
  GET = async (req: Request, res: Response) => {
    res.render('manage-alert-restrictions/select-user/view', {
      username: res.locals.formResponses?.username ?? req.journeyData.restrictAlert!.username,
      backUrl: 'select-alert-code',
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    req.journeyData.restrictAlert!.username = req.body.username
    res.redirect('check-answers')
  }
}
