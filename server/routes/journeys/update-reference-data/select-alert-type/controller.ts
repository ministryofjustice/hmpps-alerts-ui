import { Request, Response } from 'express'
import { SchemaType } from './schemas'
import BaseController from '../../../common/controller'
import { escapeHtml } from '../../../../utils/utils'
import { getAlertTypeFilter } from './utils'
import { AlertType } from '../../../../@types/alerts/alertsApiTypes'

export default class SelectAlertTypeController extends BaseController {
  GET = async (req: Request, res: Response) => {
    const alertType =
      res.locals.formResponses?.alertType ??
      req.journeyData.updateRefData!.updateAlertCodeSubJourney?.alertType ??
      req.journeyData.updateRefData!.alertType

    const alertTypeOptions = [
      ...(await this.alertsApiService.retrieveAlertTypes(req.middleware.clientToken, true))
        .filter(getAlertTypeFilter(req.journeyData.updateRefData!))
        .sort((a, b) => a.code.localeCompare(b.code))
        .map(refData => ({
          value: refData.code,
          html: `${escapeHtml(refData.code)} (${escapeHtml(refData.description)})${this.getTags(refData)}`,
          checked: typeof alertType === 'string' ? refData.code === alertType : refData.code === alertType?.code,
        })),
    ]

    res.render('update-reference-data/select-alert-type/view', {
      alertTypeOptions,
      backUrl: req.journeyData.isCheckAnswers ? 'check-answers' : 'select-change',
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    const journey = req.journeyData.updateRefData!

    if (journey.referenceDataType === 'ALERT_TYPE') {
      journey.alertType = req.body.alertType
      switch (journey.changeType) {
        case 'EDIT_DESCRIPTION':
          res.redirect(req.journeyData.isCheckAnswers ? 'check-answers' : 'edit-alert-type')
          break
        case 'DEACTIVATE':
          res.redirect(req.journeyData.isCheckAnswers ? 'check-answers' : 'deactivate-alert-type')
          break
        case 'REACTIVATE':
        default:
          res.redirect(req.journeyData.isCheckAnswers ? 'check-answers' : 'check-answers')
      }
    } else {
      switch (journey.changeType) {
        case 'ADD_NEW':
          journey.alertType = req.body.alertType
          res.redirect(req.journeyData.isCheckAnswers ? 'check-answers' : 'add-alert-code')
          break
        case 'EDIT_DESCRIPTION':
        case 'DEACTIVATE':
        case 'REACTIVATE':
        default:
          journey.updateAlertCodeSubJourney = { alertType: req.body.alertType }
          res.redirect('select-alert-code')
          break
      }
    }
  }

  private getTags = (type: AlertType) => {
    return type.isActive
      ? ''
      : ' <strong class="govuk-tag status-tag govuk-tag--blue govuk-!-margin-left-1">Deactivated</strong>'
  }
}
