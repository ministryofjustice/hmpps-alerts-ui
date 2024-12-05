import BaseRouter from '../../../common/routes'
import { validate } from '../../../../middleware/validationMiddleware'
import { schemaFactory } from './schemas'
import SelectPrisonerController from './controller'
import PrisonerSearchApiClient from '../../../../data/prisonerSearchApiClient'
import SelectPrisonerQueryRoutes from './query/routes'
import AlertsApiClient from '../../../../data/alertsApiClient'

export default function SelectPrisonerRoutes(
  prisonerSearchApiClient: PrisonerSearchApiClient,
  alertsApiClient: AlertsApiClient,
) {
  const { router, get, post } = BaseRouter()
  const controller = new SelectPrisonerController(prisonerSearchApiClient, alertsApiClient)

  get('/', controller.GET)
  post('/', validate(schemaFactory), controller.UPDATE_BACKEND_SESSION, controller.POST)

  router.use('/query', SelectPrisonerQueryRoutes())

  return router
}
