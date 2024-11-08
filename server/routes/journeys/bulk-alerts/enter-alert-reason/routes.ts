import BaseRouter from '../../../common/routes'
import { validate } from '../../../../middleware/validationMiddleware'
import { schema } from './schemas'
import EnterAlertReasonController from './controller'

export default function EnterAlertReasonRoutes() {
  const { router, get, post } = BaseRouter()
  const controller = new EnterAlertReasonController()

  get('/', controller.GET)
  post('/', validate(schema), controller.POST)

  return router
}
