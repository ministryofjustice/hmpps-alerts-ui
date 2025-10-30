import { Request, Response } from 'express'
import { SchemaType } from './schemas'
import BaseController from '../../../common/controller'
import { escapeHtml } from '../../../../utils/utils'
import { getAlertCodeFilter } from './utils'
import { AlertCode } from '../../../../@types/alerts/alertsApiTypes'

export default class SelectAlertCodeController extends BaseController {
  GET = async (req: Request, res: Response) => {
    const alertCode = res.locals.formResponses?.alertCode ?? req.journeyData.restrictAlert!.alertCode

    const alertCodeOptions = [
      ...(await this.alertsApiService.retrieveAlertTypes(req.middleware.clientToken, true))
        .find(type => type.code === req.journeyData.restrictAlert?.alertType?.code)!
        .alertCodes.filter(getAlertCodeFilter(req.journeyData.restrictAlert!))
        .sort((a, b) => a.code.localeCompare(b.code))
        .map(refData => ({
          value: refData.code,
          html: `${escapeHtml(refData.code)} (${escapeHtml(refData.description)})${this.getTags(refData)}`,
          checked: typeof alertCode === 'string' ? refData.code === alertCode : refData.code === alertCode?.code,
        })),
    ]

    res.render('manage-alert-restrictions/select-alert-code/view', {
      journey: req.journeyData.restrictAlert!,
      alertCodeOptions,
      backUrl: 'select-alert-type',
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    const journey = req.journeyData.restrictAlert!

    journey.alertCode = req.body.alertCode

    switch (journey.changeType) {
      case 'ADD_PRIVILEGED_USER':
      case 'REMOVE_PRIVILEGED_USER':
        res.redirect('select-user')
        break
      default:
        res.redirect('check-answers')
        break
    }
  }

  private getTags = (code: AlertCode) => {
    const activeTag = code.isActive
      ? ''
      : ' <strong class="govuk-tag status-tag govuk-tag--blue govuk-!-margin-left-1">Deactivated</strong>'
    const restrictedTag = code.isRestricted
      ? ' <strong class="govuk-tag status-tag govuk-tag--yellow govuk-!-margin-left-1">Restricted</strong>'
      : ''
    return `${activeTag}${restrictedTag}`
  }
}
