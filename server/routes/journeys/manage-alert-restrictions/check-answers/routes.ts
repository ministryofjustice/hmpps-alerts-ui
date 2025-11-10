import AlertsApiClient from '../../../../data/alertsApiClient'
import AuditService from '../../../../services/auditService'
import BaseRouter from '../../../common/routes'
import ManageAlertRestrictionsCheckAnswersController from './controller'

export default function ManageAlertRestrictionsCheckAnswersRoutes(
  alertsApiClient: AlertsApiClient,
  auditService: AuditService,
) {
  const { router, get, post } = BaseRouter()
  const controller = new ManageAlertRestrictionsCheckAnswersController(alertsApiClient, auditService)

  get('/', controller.GET)
  post('/', controller.checkSubmitToAPI, controller.POST)

  return router
}
