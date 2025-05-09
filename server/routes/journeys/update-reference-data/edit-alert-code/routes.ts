import BaseRouter from '../../../common/routes'
import { validate } from '../../../../middleware/validationMiddleware'
import { schema } from './schemas'
import EditAlertCodeController from './controller'

export default function EditAlertCodeRoutes() {
  const { router, get, post } = BaseRouter()
  const controller = new EditAlertCodeController()

  get('/', controller.GET)
  post('/', validate(schema), controller.POST)

  return router
}
