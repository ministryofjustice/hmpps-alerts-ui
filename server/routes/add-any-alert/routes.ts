import BaseRouter from '../common/routes'
import AlertsApiClient from '../../data/alertsApiClient'
import AddAnyAlertController from './controller'
import authorisationMiddleware from '../../middleware/authorisationMiddleware'
import AuthorisedRoles from '../../authentication/authorisedRoles'
import { validate } from '../../middleware/validationMiddleware'
import { schemaFactory } from './schemas'

export default function AddAnyAlertRoutes(alertsApiClient: AlertsApiClient) {
  const { router, get, post } = BaseRouter()
  const controller = new AddAnyAlertController(alertsApiClient)

  router.use(authorisationMiddleware([AuthorisedRoles.ROLE_MANAGE_SECURE_ALERTS], false))

  get('/', controller.GET)
  post('/', validate(schemaFactory(alertsApiClient)), controller.POST)

  return router
}
