import { NextFunction, Request, Response } from 'express'
import BaseController from '../common/controller'
import { pastDateStringGBFormat, todayStringGBFormat } from '../../utils/datetimeUtils'
import { FLASH_KEY__SUCCESS_MESSAGE } from '../../utils/constants'
import { SchemaType } from './schemas'
import { firstNameSpaceLastName } from '../../utils/miniProfileUtils'
import { getNonUndefinedProp } from '../../utils/utils'

export default class AddAnyAlertController extends BaseController {
  GET = async (req: Request, res: Response) => {
    const alertType = res.locals.formResponses?.['alertType'] ?? req.query['alertType']
    const alertCode = res.locals.formResponses?.['alertCode'] ?? req.query['alertCode']
    const prisonNumber = res.locals.formResponses?.['prisonNumber']
    if (prisonNumber) {
      res.locals.auditEvent.subjectId = prisonNumber
      res.locals.auditEvent.subjectType = prisonNumber
    }
    if (alertCode) {
      res.locals.auditEvent.details['alertCode'] = alertCode
    }

    const { alertTypes, alertCodes, typeCodeMap } = await this.mapAlertTypes({
      req,
      includeInactive: true,
      ...(alertType ? { type: alertType as string } : {}),
    })
    res.render('add-any-alert/view', {
      successMessage: req.flash(FLASH_KEY__SUCCESS_MESSAGE)[0],
      prisonNumber,
      alertType,
      alertCode,
      description: res.locals.formResponses?.['description'],
      activeFrom: res.locals.formResponses?.['activeFrom'] ?? todayStringGBFormat(),
      activeTo: res.locals.formResponses?.['activeTo'],
      today: todayStringGBFormat(),
      todayMinus8: pastDateStringGBFormat(7),
      alertTypes,
      alertCodes,
      typeCodeMap,
    })
  }

  checkSubmitToAPI = async (req: Request<unknown, unknown, SchemaType>, res: Response, next: NextFunction) => {
    try {
      await this.alertsApiService.createAlert(req.middleware.clientToken, req.body.prisonNumber.prisonerNumber, {
        alertCode: req.body.alertCode.code,
        authorisedBy: res.locals.user.displayName,
        ...getNonUndefinedProp(req.body, 'description'),
        ...getNonUndefinedProp(req.body, 'activeFrom'),
        ...getNonUndefinedProp(req.body, 'activeTo'),
      })
      req.flash(
        FLASH_KEY__SUCCESS_MESSAGE,
        `You’ve created a ‘${req.body.alertCode.description}’ alert for ${firstNameSpaceLastName(req.body.prisonNumber)}`,
      )
      next()
    } catch (e) {
      next(e)
    }
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    res.redirect(`/add-any-alert?alertType=${req.body.alertType.code}&alertCode=${req.body.alertCode.code}`)
  }
}
