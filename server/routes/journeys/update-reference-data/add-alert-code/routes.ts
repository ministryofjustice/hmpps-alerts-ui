import BaseRouter from '../../../common/routes'
import { validate } from '../../../../middleware/validationMiddleware'
import { schemaFactory } from './schemas'
import AddAlertCodeController from './controller'
import AlertsApiClient from '../../../../data/alertsApiClient'

export default function AddAlertCodeRoutes(alertsApiClient: AlertsApiClient) {
  const { router, get, post } = BaseRouter()
  const controller = new AddAlertCodeController()

  get('/', controller.GET)
  post('/', validate(schemaFactory(alertsApiClient)), controller.POST)

  return router
}
