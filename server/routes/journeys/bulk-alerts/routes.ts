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

export default function BulkAlertsRoutes({ alertsApiClient, prisonerSearchApiClient }: DataAccess) {
  const { router, get, post } = BaseRouter()
  const controller = new BulkAlertsController(alertsApiClient)

  router.use(authorisationMiddleware([AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS], false))

  get('/', controller.GET)
  post('/', validate(schemaFactory(alertsApiClient)), controller.POST)

  router.use('/enter-alert-reason', EnterAlertReasonRoutes())
  router.use('/how-to-add-prisoners', HowToAddPrisonersRoutes())
  router.use('/select-prisoner', SelectPrisonerRoutes(prisonerSearchApiClient))
  router.use('/upload-prisoner-list', UploadPrisonerListRoutes(prisonerSearchApiClient))
  router.use('/review-prisoners', ReviewPrisonersRoutes())

  return router
}
