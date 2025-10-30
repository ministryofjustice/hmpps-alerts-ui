import BaseRouter from '../../common/routes'
import authorisationMiddleware from '../../../middleware/authorisationMiddleware'
import AuthorisedRoles from '../../../authentication/authorisedRoles'
import { validate } from '../../../middleware/validationMiddleware'
import { schema } from './schemas'
import redirectCheckAnswersMiddleware from '../../../middleware/redirectCheckAnswersMiddleware'
import AlertsApiClient from '../../../data/alertsApiClient'
import AuditService from '../../../services/auditService'
import ManageAlertRestrictionsController from './controller'
import SelectAlertTypeRoutes from './select-alert-type/routes'
import SelectAlertCodeRoutes from './select-alert-code/routes'
import SelectUserRoutes from './select-user/routes'
import ManageAlertRestrictionsCheckAnswersRoutes from './check-answers/routes'
import ManageAlertRestrictionConfirmationRoutes from './confirmation/routes'

export default function ManageAlertRestrictionRoutes(alertsApiClient: AlertsApiClient, auditService: AuditService) {
  const { router, get, post } = BaseRouter()
  const controller = new ManageAlertRestrictionsController()

  router.use(authorisationMiddleware([AuthorisedRoles.ROLE_DPS_APPLICATION_DEVELOPER], false))

  router.use(
    redirectCheckAnswersMiddleware([/select-alert-type$/, /select-alert-code$/, /select-user$/, /check-answers$/]),
  )

  get('/', controller.GET)
  post('/', validate(schema), controller.POST)

  router.get('*any', (req, res, next) => {
    const { alertCode } = req.journeyData.restrictAlert!
    res.locals.auditEvent.subjectType = 'ALERT_CODE'
    if (alertCode) {
      res.locals.auditEvent.subjectId = alertCode.code
    }
    res.locals.auditEvent.who = res.locals.user.username
    next()
  })

  router.use('/select-alert-type', SelectAlertTypeRoutes(alertsApiClient))
  router.use('/select-alert-code', SelectAlertCodeRoutes(alertsApiClient))
  router.use('/select-user', SelectUserRoutes())
  router.use('/check-answers', ManageAlertRestrictionsCheckAnswersRoutes(alertsApiClient, auditService))
  router.use('/confirmation', ManageAlertRestrictionConfirmationRoutes())

  return router
}
