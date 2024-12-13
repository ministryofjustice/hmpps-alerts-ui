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

export default function BulkAlertsRoutes({ alertsApiClient, prisonerSearchApiClient }: DataAccess) {
  const { router, get, post } = BaseRouter()
  const controller = new BulkAlertsController(alertsApiClient)

  router.use(authorisationMiddleware([AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS], false))

  router.use(
    redirectCheckAnswersMiddleware([
      /bulk-alerts$/,
      /enter-alert-reason$/,
      /select-prisoner(\/query)?$/,
      /upload-prisoner-list(\?_csrf=.+)?$/,
      /review-prisoners\?remove=[A-z0-9]+/,
      /check-answers$/,
    ]),
  )

  get('/', controller.GET)
  post('/', validate(schemaFactory(alertsApiClient)), controller.START_BACKEND_SESSION, controller.POST)

  router.get('*', (req, res, next) => {
    const { planId, alertCode, alertType, alertCodeSubJourney } = req.journeyData.bulkAlert!
    if (planId) {
      const detailsAlertType = alertType?.code || alertCodeSubJourney?.alertType?.code
      const detailsAlertCode = alertCode?.code || alertCodeSubJourney?.alertCode?.code
      res.locals.auditEvent.subjectId = planId
      res.locals.auditEvent.subjectType = planId
      res.locals.auditEvent.details = {
        ...res.locals.auditEvent.details,
        ...(detailsAlertType && { alertType: detailsAlertType }),
        ...(detailsAlertCode && { alertCode: detailsAlertCode }),
      }
    }
    next()
  })

  router.use('/enter-alert-reason', EnterAlertReasonRoutes())
  router.use('/how-to-add-prisoners', HowToAddPrisonersRoutes())
  router.use('/select-prisoner', SelectPrisonerRoutes(prisonerSearchApiClient, alertsApiClient))
  router.use('/upload-prisoner-list', UploadPrisonerListRoutes(alertsApiClient))
  router.use('/review-prisoners', ReviewPrisonersRoutes(alertsApiClient))
  router.use('/select-upload-logic', SelectUploadLogicRoutes())
  router.use('/check-answers', BulkAlertsCheckAnswersRoutes(alertsApiClient))
  router.use('/confirmation', BulkAlertsConfirmationRoutes())

  return router
}
