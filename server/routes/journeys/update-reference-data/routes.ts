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

export default function UpdateReferenceDataRoutes(alertsApiClient: AlertsApiClient, auditService: AuditService) {
  const { router, get, post } = BaseRouter()
  const controller = new UpdateReferenceDataController()

  router.use(authorisationMiddleware([AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER], false))

  router.use(redirectCheckAnswersMiddleware([/select-alert-type$/, /select-alert-code$/, /check-answers$/]))

  get('/', controller.GET)
  post('/', validate(schema), controller.POST)

  router.get('*any', (req, res, next) => {
    const { referenceDataType } = req.journeyData.updateRefData!
    if (referenceDataType) {
      res.locals.auditEvent.subjectType = referenceDataType
    }
    next()
  })

  router.use('/select-change', SelectChangeRoutes())
  router.use('/add-alert-type', AddAlertTypeRoutes(alertsApiClient))
  router.use('/select-alert-type', SelectAlertTypeRoutes(alertsApiClient))
  router.use('/add-alert-code', AddAlertCodeRoutes(alertsApiClient))
  router.use('/select-alert-code', SelectAlertCodeRoutes(alertsApiClient))
  router.use('/check-answers', UpdateReferenceDataCheckAnswersRoutes(alertsApiClient, auditService))
  router.use('/confirmation', UpdateReferenceDataConfirmationRoutes())

  return router
}
