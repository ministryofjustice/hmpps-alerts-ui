import { RequestHandler } from 'express'

export default class CreateAlertTypeRoutes {
  public startPage: RequestHandler = async (req, res): Promise<void> => {
    return res.render('pages/createAlertType/index')
  }

  public submitAlertType: RequestHandler = async (req, res): Promise<void> => {
    const alertTypeCodeErrorMessage = 'An alert type code must be entered'
    const alertTypeDescriptionErrorMessage = 'An alert type description must be entered'
    const { alertTypeCode, alertTypeDescription } = req.body
    if (this.isNullOrEmpty(alertTypeCode) && this.isNullOrEmpty(alertTypeDescription)) {
      return res.render('pages/createAlertType/index', { alertTypeCodeErrorMessage, alertTypeDescriptionErrorMessage })
    }
    if (this.isNullOrEmpty(alertTypeCode)) {
      return res.render('pages/createAlertType/index', { alertTypeCodeErrorMessage, alertTypeDescription })
    }
    if (this.isNullOrEmpty(alertTypeDescription)) {
      return res.render('pages/createAlertType/index', { alertTypeDescriptionErrorMessage, alertTypeCode })
    }
    return res.render('pages/createAlertType/confirmation', { alertTypeCode, alertTypeDescription })
  }

  private isNullOrEmpty(value: string): boolean {
    return value === null || value === undefined || value === ''
  }
}
