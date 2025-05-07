import AlertsApiClient from '../../../../data/alertsApiClient'
import AuditService from '../../../../services/auditService'
import BaseRouter from '../../../common/routes'
import UpdateReferenceDataCheckAnswersController from './controller'

export default function UpdateReferenceDataCheckAnswersRoutes(
  alertsApiClient: AlertsApiClient,
  auditService: AuditService,
) {
  const { router, get, post } = BaseRouter()
  const controller = new UpdateReferenceDataCheckAnswersController(alertsApiClient, auditService)

  get('/', controller.GET)
  post('/', controller.checkSubmitToAPI, controller.POST)

  return router
}
