import BaseRouter from '../common/routes'
import AlertsApiClient from '../../data/alertsApiClient'
import authorisationMiddleware from '../../middleware/authorisationMiddleware'
import AuthorisedRoles from '../../authentication/authorisedRoles'
import { validate } from '../../middleware/validationMiddleware'
import { schemaFactory } from './schemas'
import AuditService from '../../services/auditService'
import DeleteAlertController from './controller'

export default function DeleteAlertRoutes(alertsApiClient: AlertsApiClient, auditService: AuditService) {
  const { router, get, post } = BaseRouter()
  const controller = new DeleteAlertController(alertsApiClient, auditService)

  router.use(authorisationMiddleware([AuthorisedRoles.ROLE_DPS_APPLICATION_DEVELOPER], false))

  get('/', controller.GET)
  post('/', validate(schemaFactory(alertsApiClient)), controller.checkSubmitToAPI, controller.POST)

  return router
}
