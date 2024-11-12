import BaseRouter from '../../../common/routes'
import { validate } from '../../../../middleware/validationMiddleware'
import { schemaFactory } from './schemas'
import SelectPrisonerController from './controller'
import PrisonerSearchApiClient from '../../../../data/prisonerSearchApiClient'
import SelectPrisonerQueryRoutes from './query/routes'

export default function SelectPrisonerRoutes(prisonerSearchApiClient: PrisonerSearchApiClient) {
  const { router, get, post } = BaseRouter()
  const controller = new SelectPrisonerController(prisonerSearchApiClient)

  get('/', controller.GET)
  post('/', validate(schemaFactory), controller.POST)

  router.use('/query', SelectPrisonerQueryRoutes())

  return router
}
