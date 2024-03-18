import { RequestHandler } from 'express'

export default class CreateAlertTypeRoutes {
  public startPage: RequestHandler = async (req, res): Promise<void> => {
    return res.render('pages/createAlertType/index')
  }
}
