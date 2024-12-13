import BaseRouter from '../common/routes'
import AlertsApiClient from '../../data/alertsApiClient'
import AddAnyAlertController from './controller'
import authorisationMiddleware from '../../middleware/authorisationMiddleware'
import AuthorisedRoles from '../../authentication/authorisedRoles'
import { validate } from '../../middleware/validationMiddleware'
import { schemaFactory } from './schemas'
import PrisonerSearchApiClient from '../../data/prisonerSearchApiClient'
import AuditService from '../../services/auditService'

export default function AddAnyAlertRoutes(
  alertsApiClient: AlertsApiClient,
  prisonerSearchApiClient: PrisonerSearchApiClient,
  auditService: AuditService,
) {
  const { router, get, post } = BaseRouter()
  const controller = new AddAnyAlertController(alertsApiClient, auditService)

  router.use(authorisationMiddleware([AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS], false))

  get('/', controller.GET)
  post(
    '/',
    validate(schemaFactory(alertsApiClient, prisonerSearchApiClient)),
    controller.checkSubmitToAPI,
    controller.POST,
  )

  return router
}
