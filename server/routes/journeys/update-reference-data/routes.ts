import BaseRouter from '../../common/routes'
import authorisationMiddleware from '../../../middleware/authorisationMiddleware'
import AuthorisedRoles from '../../../authentication/authorisedRoles'
import { validate } from '../../../middleware/validationMiddleware'
import { schema } from './schemas'
import redirectCheckAnswersMiddleware from '../../../middleware/redirectCheckAnswersMiddleware'
import UpdateReferenceDataController from './controller'
import SelectChangeRoutes from './select-change/routes'
import AddAlertTypeRoutes from './add-alert-type/routes'
import UpdateReferenceDataCheckAnswersRoutes from './check-answers/routes'
import AlertsApiClient from '../../../data/alertsApiClient'
import AuditService from '../../../services/auditService'
import UpdateReferenceDataConfirmationRoutes from './confirmation/routes'
import SelectAlertTypeRoutes from './select-alert-type/routes'
import AddAlertCodeRoutes from './add-alert-code/routes'
import SelectAlertCodeRoutes from './select-alert-code/routes'
import EditAlertCodeRoutes from './edit-alert-code/routes'
import DeactivateAlertCodeRoutes from './deactivate-alert-code/routes'
import EditAlertTypeRoutes from './edit-alert-type/routes'
import DeactivateAlertTypeRoutes from './deactivate-alert-type/routes'

export default function UpdateReferenceDataRoutes(alertsApiClient: AlertsApiClient, auditService: AuditService) {
  const { router, get, post } = BaseRouter()
  const controller = new UpdateReferenceDataController()

  router.use(authorisationMiddleware([AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER], false))

  router.use(redirectCheckAnswersMiddleware([/select-alert-type$/, /select-alert-code$/, /check-answers$/]))

  get('/', controller.GET)
  post('/', validate(schema), controller.POST)

  router.get('*any', (req, res, next) => {
    const { referenceDataType, alertType, alertCode } = req.journeyData.updateRefData!
    if (referenceDataType) {
      res.locals.auditEvent.subjectType = referenceDataType
      if (referenceDataType === 'ALERT_TYPE' && alertType) {
        res.locals.auditEvent.subjectId = alertType.code
      } else if (referenceDataType === 'ALERT_CODE' && alertCode) {
        res.locals.auditEvent.subjectId = alertCode.code
      }
    }
    res.locals.auditEvent.who = res.locals.user.username
    next()
  })

  router.use('/select-change', SelectChangeRoutes())
  router.use('/add-alert-type', AddAlertTypeRoutes(alertsApiClient))
  router.use('/select-alert-type', SelectAlertTypeRoutes(alertsApiClient))
  router.use('/add-alert-code', AddAlertCodeRoutes(alertsApiClient))
  router.use('/select-alert-code', SelectAlertCodeRoutes(alertsApiClient))
  router.use('/edit-alert-code', EditAlertCodeRoutes())
  router.use('/edit-alert-type', EditAlertTypeRoutes())
  router.use('/deactivate-alert-code', DeactivateAlertCodeRoutes(alertsApiClient, auditService))
  router.use('/deactivate-alert-type', DeactivateAlertTypeRoutes(alertsApiClient, auditService))
  router.use('/check-answers', UpdateReferenceDataCheckAnswersRoutes(alertsApiClient, auditService))
  router.use('/confirmation', UpdateReferenceDataConfirmationRoutes())

  return router
}
