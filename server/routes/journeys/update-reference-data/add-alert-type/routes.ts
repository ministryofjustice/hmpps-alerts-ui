import BaseRouter from '../../../common/routes'
import { validate } from '../../../../middleware/validationMiddleware'
import { schemaFactory } from './schemas'
import AddAlertTypeController from './controller'
import AlertsApiClient from '../../../../data/alertsApiClient'

export default function AddAlertTypeRoutes(alertsApiClient: AlertsApiClient) {
  const { router, get, post } = BaseRouter()
  const controller = new AddAlertTypeController()

  get('/', controller.GET)
  post('/', validate(schemaFactory(alertsApiClient)), controller.POST)

  return router
}
