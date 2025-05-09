import AlertsApiClient from '../../../../data/alertsApiClient'
import AuditService from '../../../../services/auditService'
import BaseRouter from '../../../common/routes'
import DeactivateAlertCodeController from './controller'
import { validate } from '../../../../middleware/validationMiddleware'
import { schema } from './schemas'

export default function DeactivateAlertCodeRoutes(alertsApiClient: AlertsApiClient, auditService: AuditService) {
  const { router, get, post } = BaseRouter()
  const controller = new DeactivateAlertCodeController(alertsApiClient, auditService)

  get('/', controller.GET)
  post('/', validate(schema), controller.POST)

  return router
}
