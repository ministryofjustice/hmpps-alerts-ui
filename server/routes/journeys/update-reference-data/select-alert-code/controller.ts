import { Request, Response } from 'express'
import { SchemaType } from './schemas'
import BaseController from '../../../common/controller'
import { escapeHtml } from '../../../../utils/utils'
import { getAlertCodeFilter } from './utils'

export default class SelectAlertCodeController extends BaseController {
  GET = async (req: Request, res: Response) => {
    const alertCode = res.locals.formResponses?.['alertCode'] ?? req.journeyData.updateRefData!.alertCode

    const alertCodeOptions = [
      ...(await this.alertsApiService.retrieveAlertTypes(req.middleware.clientToken, true))
        .find(
          type =>
            type.code ===
            (req.journeyData.updateRefData?.updateAlertCodeSubJourney?.alertType?.code ??
              req.journeyData.updateRefData?.alertType?.code),
        )!
        .alertCodes.filter(getAlertCodeFilter(req.journeyData.updateRefData!))
        .sort((a, b) => a.code.localeCompare(b.code))
        .map(refData => ({
          value: refData.code,
          html: `${escapeHtml(refData.code)} (${escapeHtml(refData.description)})${
            refData.isActive
              ? ''
              : ' <strong class="govuk-tag status-tag govuk-tag--blue govuk-!-margin-left-1">Deactivated</strong>'
          }`,
          checked: typeof alertCode === 'string' ? refData.code === alertCode : refData.code === alertCode?.code,
        })),
    ]

    res.render('update-reference-data/select-alert-code/view', {
      journey: req.journeyData.updateRefData!,
      alertCodeOptions,
      backUrl:
        req.journeyData.isCheckAnswers && !req.journeyData.updateRefData!.updateAlertCodeSubJourney
          ? 'check-answers'
          : 'select-alert-type',
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    const journey = req.journeyData.updateRefData!

    journey.alertCode = req.body.alertCode
    if (journey.updateAlertCodeSubJourney) {
      journey.alertType = journey.updateAlertCodeSubJourney!.alertType
      delete journey.updateAlertCodeSubJourney
    }

    switch (journey.changeType) {
      case 'EDIT_DESCRIPTION':
        res.redirect(req.journeyData.isCheckAnswers ? 'check-answers' : 'edit-alert-code')
        break
      case 'DEACTIVATE':
        res.redirect('deactivate-alert-code')
        break
      case 'REACTIVATE':
      default:
        res.redirect('check-answers')
        break
    }
  }
}
