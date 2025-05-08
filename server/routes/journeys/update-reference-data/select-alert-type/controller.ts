import { Request, Response } from 'express'
import { SchemaType } from './schemas'
import BaseController from '../../../common/controller'
import { AlertType } from '../../../../@types/alerts/alertsApiTypes'

export default class SelectAlertTypeController extends BaseController {
  GET = async (req: Request, res: Response) => {
    const journey = req.journeyData.updateRefData!
    const alertType = res.locals.formResponses?.['alertType'] ?? journey.alertType

    let typeFilter = (_type: AlertType) => true

    if (journey.referenceDataType === 'ALERT_TYPE') {
      if (journey.changeType === 'DEACTIVATE') {
        typeFilter = (type: AlertType) => type.isActive
      } else if (journey.changeType === 'REACTIVATE') {
        typeFilter = (type: AlertType) => !type.isActive
      }
    }

    const alertTypeOptions = [
      ...(await this.alertsApiService.retrieveAlertTypes(req.middleware.clientToken, true))
        .filter(typeFilter)
        .map(refData => ({
          value: refData.code,
          text: refData.description,
          checked: typeof alertType === 'string' ? refData.code === alertType : refData.code === alertType?.code,
        })),
    ]

    res.render('update-reference-data/select-alert-type/view', {
      alertTypeOptions,
      backUrl: 'select-change',
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    const journey = req.journeyData.updateRefData!

    journey.alertType = req.body.alertType

    if (journey.referenceDataType === 'ALERT_TYPE') {
      switch (journey.changeType) {
        case 'EDIT_DESCRIPTION':
          res.redirect('edit-alert-type')
          break
        case 'DEACTIVATE':
          res.redirect('deactivate-alert-type')
          break
        case 'REACTIVATE':
        default:
          res.redirect('check-answers')
      }
    } else {
      switch (journey.changeType) {
        case 'ADD_NEW':
          res.redirect('add-alert-code')
          break
        case 'EDIT_DESCRIPTION':
        case 'DEACTIVATE':
        case 'REACTIVATE':
        default:
          res.redirect('select-alert-code')
          break
      }
    }
  }
}
