import { Request, Response } from 'express'
import { SchemaType } from './schemas'
import BaseController from '../../../common/controller'
import { escapeHtml } from '../../../../utils/utils'
import { getAlertTypeFilter } from './utils'
import { AlertType } from '../../../../@types/alerts/alertsApiTypes'

export default class SelectAlertTypeController extends BaseController {
  GET = async (req: Request, res: Response) => {
    const alertType = res.locals.formResponses?.alertType ?? req.journeyData.restrictAlert!.alertType

    const alertTypeOptions = [
      ...(await this.alertsApiService.retrieveAlertTypes(req.middleware.clientToken, true))
        .filter(getAlertTypeFilter(req.journeyData.restrictAlert!))
        .sort((a, b) => a.code.localeCompare(b.code))
        .map(refData => ({
          value: refData.code,
          html: `${escapeHtml(refData.code)} (${escapeHtml(refData.description)})${this.getTags(refData)}`,
          checked: typeof alertType === 'string' ? refData.code === alertType : refData.code === alertType?.code,
        })),
    ]

    res.render('manage-alert-restrictions/select-alert-type/view', {
      alertTypeOptions,
      backUrl: '../manage-alert-restrictions',
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    req.journeyData.restrictAlert!.alertType = req.body.alertType
    res.redirect('select-alert-code')
  }

  private getTags = (type: AlertType) => {
    return type.isActive
      ? ''
      : ' <strong class="govuk-tag status-tag govuk-tag--blue govuk-!-margin-left-1">Deactivated</strong>'
  }
}
