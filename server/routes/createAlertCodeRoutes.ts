import { RequestHandler } from 'express'

export default class CreateAlertCodeRoutes {
  public startPage: RequestHandler = async (req, res): Promise<void> => {
    return res.render('pages/createAlertCode/index')
  }
}
