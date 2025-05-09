import AlertsApiClient from '../../../../data/alertsApiClient'
import AuditService from '../../../../services/auditService'
import BaseRouter from '../../../common/routes'
import DeactivateAlertTypeController from './controller'
import { validate } from '../../../../middleware/validationMiddleware'
import { schema } from './schemas'

export default function DeactivateAlertTypeRoutes(alertsApiClient: AlertsApiClient, auditService: AuditService) {
  const { router, get, post } = BaseRouter()
  const controller = new DeactivateAlertTypeController(alertsApiClient, auditService)

  get('/', controller.GET)
  post('/', validate(schema), controller.POST)

  return router
}
