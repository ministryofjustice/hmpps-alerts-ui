import { Request, Response } from 'express'
import BaseController from '../common/controller'
import { pastDateStringGBFormat, todayStringGBFormat } from '../../utils/datetimeUtils'
import { FLASH_KEY__SUCCESS_MESSAGE } from '../../utils/constants'

export default class AddAnyAlertController extends BaseController {
  GET = async (req: Request, res: Response) => {
    const alertType = res.locals.formResponses?.alertType ?? req.query.alertType
    const alertCode = res.locals.formResponses?.alertCode ?? req.query.alertCode

    const { alertTypes, alertCodes, typeCodeMap } = await this.mapAlertTypes({
      req,
      includeInactive: true,
      ...(alertType ? { type: alertType as string } : {}),
    })
    res.render('add-any-alert/view', {
      prisonNumber: res.locals.formResponses?.prisonNumber,
      alertType,
      alertCode,
      description: res.locals.formResponses?.description,
      activeFrom: res.locals.formResponses?.activeFrom ?? todayStringGBFormat(),
      activeTo: res.locals.formResponses?.activeTo,
      today: todayStringGBFormat(),
      todayMinus8: pastDateStringGBFormat(7),
      alertTypes,
      alertCodes,
      typeCodeMap,
    })
  }

  POST = (req: Request, res: Response) => {
    req.flash(FLASH_KEY__SUCCESS_MESSAGE, `You’ve created a ‘${req.body.alertCode}’ alert for ${req.body.prisonNumber}`)
    res.redirect('/')
  }
}
