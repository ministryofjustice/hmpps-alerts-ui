import BaseRouter from '../../../common/routes'
import ReviewPrisonersController from './controller'
import AlertsApiClient from '../../../../data/alertsApiClient'

export default function ReviewPrisonersRoutes(alertsApiClient: AlertsApiClient) {
  const { router, get, post } = BaseRouter()
  const controller = new ReviewPrisonersController(alertsApiClient)

  get('/', controller.GET)
  post('/', controller.POST)

  return router
}
