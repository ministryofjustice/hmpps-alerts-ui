import BaseRouter from '../../common/routes'
import authorisationMiddleware from '../../../middleware/authorisationMiddleware'
import AuthorisedRoles from '../../../authentication/authorisedRoles'
import { validate } from '../../../middleware/validationMiddleware'
import { schemaFactory } from './schemas'
import { DataAccess } from '../../../data'
import BulkAlertsController from './controller'
import EnterAlertReasonRoutes from './enter-alert-reason/routes'
import HowToAddPrisonersRoutes from './how-to-add-prisoners/routes'
import SelectPrisonerRoutes from './select-prisoner/routes'
import ReviewPrisonersRoutes from './review-prisoners/routes'
import UploadPrisonerListRoutes from './upload-prisoner-list/routes'
import SelectUploadLogicRoutes from './select-upload-logic/routes'
import BulkAlertsCheckAnswersRoutes from './check-answers/routes'
import redirectCheckAnswersMiddleware from '../../../middleware/redirectCheckAnswersMiddleware'
import BulkAlertsConfirmationRoutes from './confirmation/routes'
import { Services } from '../../../services'
import BulkAlertsCancellationCheckRoutes from './cancellation-check/routes'

export default function BulkAlertsRoutes(
  { alertsApiClient, prisonerSearchApiClient }: DataAccess,
  { auditService }: Services,
) {
  const { router, get, post } = BaseRouter()
  const controller = new BulkAlertsController(alertsApiClient, auditService)

  router.use(authorisationMiddleware([AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS], false))

  router.use(
    redirectCheckAnswersMiddleware([
      /bulk-alerts$/,
      /enter-alert-reason$/,
      /select-prisoner(\/query)?$/,
      /upload-prisoner-list(\?_csrf=.+)?$/,
      /review-prisoners\?remove=[A-z0-9]+/,
      /check-answers$/,
      /cancellation-check$/,
    ]),
  )

  get('/', controller.GET)
  post('/', validate(schemaFactory(alertsApiClient)), controller.START_BACKEND_SESSION, controller.POST)

  router.get('*any', (req, res, next) => {
    const { planId, alertCode, alertType, alertCodeSubJourney } = req.journeyData.bulkAlert!
    const detailsAlertType = alertType?.code || alertCodeSubJourney?.alertType?.code
    const detailsAlertCode = alertCode?.code || alertCodeSubJourney?.alertCode?.code
    if (planId) {
      res.locals.auditEvent.subjectId = planId
      res.locals.auditEvent.subjectType = planId
    }
    res.locals.auditEvent.details = {
      ...res.locals.auditEvent.details,
      ...(detailsAlertType && { alertType: detailsAlertType }),
      ...(detailsAlertCode && { alertCode: detailsAlertCode }),
    }
    next()
  })

  router.use('/enter-alert-reason', EnterAlertReasonRoutes())
  router.use('/how-to-add-prisoners', HowToAddPrisonersRoutes())
  router.use('/select-prisoner', SelectPrisonerRoutes(prisonerSearchApiClient, alertsApiClient, auditService))
  router.use('/upload-prisoner-list', UploadPrisonerListRoutes(alertsApiClient))
  router.use('/review-prisoners', ReviewPrisonersRoutes(alertsApiClient))
  router.use('/select-upload-logic', SelectUploadLogicRoutes())
  router.use('/check-answers', BulkAlertsCheckAnswersRoutes(alertsApiClient, auditService))
  router.use('/confirmation', BulkAlertsConfirmationRoutes())
  router.use('/cancellation-check', BulkAlertsCancellationCheckRoutes())

  return router
}
