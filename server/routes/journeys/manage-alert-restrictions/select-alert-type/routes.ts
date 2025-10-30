import BaseRouter from '../../../common/routes'
import { validate } from '../../../../middleware/validationMiddleware'
import { schemaFactory } from './schemas'
import AlertsApiClient from '../../../../data/alertsApiClient'
import SelectAlertTypeController from './controller'

export default function SelectAlertTypeRoutes(alertsApiClient: AlertsApiClient) {
  const { router, get, post } = BaseRouter()
  const controller = new SelectAlertTypeController(alertsApiClient)

  get('/', controller.GET)
  post('/', validate(schemaFactory(alertsApiClient)), controller.POST)

  return router
}
