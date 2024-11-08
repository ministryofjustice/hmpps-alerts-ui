import BaseRouter from '../../../common/routes'
import { validate } from '../../../../middleware/validationMiddleware'
import { schema } from './schemas'
import HowToAddPrisonersController from './controller'

export default function HowToAddPrisonersRoutes() {
  const { router, get, post } = BaseRouter()
  const controller = new HowToAddPrisonersController()

  get('/', controller.GET)
  post('/', validate(schema), controller.POST)

  return router
}
