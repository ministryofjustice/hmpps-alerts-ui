import BaseRouter from '../../../common/routes'
import { validate } from '../../../../middleware/validationMiddleware'
import { schema } from './schemas'
import AddAlertCodeController from './controller'

export default function AddAlertCodeRoutes() {
  const { router, get, post } = BaseRouter()
  const controller = new AddAlertCodeController()

  get('/', controller.GET)
  post('/', validate(schema), controller.POST)

  return router
}
