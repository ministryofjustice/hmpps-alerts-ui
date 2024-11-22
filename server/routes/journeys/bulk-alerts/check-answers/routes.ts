import AlertsApiClient from '../../../../data/alertsApiClient'
import BaseRouter from '../../../common/routes'
import BulkAlertsCheckAnswersController from './controller'
import overrideTimeoutMiddleware from '../../../../middleware/overrideTimeoutMiddleware'

export default function BulkAlertsCheckAnswersRoutes(alertsApiClient: AlertsApiClient) {
  const { router, get, post } = BaseRouter()
  const controller = new BulkAlertsCheckAnswersController(alertsApiClient)

  get('/', overrideTimeoutMiddleware(5 * 60), controller.GET)
  post('/', overrideTimeoutMiddleware(5 * 60), controller.checkSubmitToAPI, controller.POST)

  return router
}
