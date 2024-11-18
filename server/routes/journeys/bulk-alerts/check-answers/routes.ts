import AlertsApiClient from '../../../../data/alertsApiClient'
import BaseRouter from '../../../common/routes'
import BulkAlertsCheckAnswersController from './controller'

export default function BulkAlertsCheckAnswersRoutes(alertsApiClient: AlertsApiClient) {
  const { router, get, post } = BaseRouter()
  const controller = new BulkAlertsCheckAnswersController(alertsApiClient)

  get('/', controller.GET)
  post('/', controller.checkSubmitToAPI, controller.POST)

  return router
}
