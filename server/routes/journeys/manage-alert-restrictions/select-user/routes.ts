import BaseRouter from '../../../common/routes'
import { validate } from '../../../../middleware/validationMiddleware'
import { schemaFactory } from './schemas'
import SelectUserController from './controller'

export default function SelectUserRoutes() {
  const { router, get, post } = BaseRouter()
  const controller = new SelectUserController()

  get('/', controller.GET)
  post('/', validate(schemaFactory()), controller.POST)

  return router
}
