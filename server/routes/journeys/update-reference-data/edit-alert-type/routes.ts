import BaseRouter from '../../../common/routes'
import { validate } from '../../../../middleware/validationMiddleware'
import { schema } from './schemas'
import EditAlertTypeController from './controller'

export default function EditAlertTypeRoutes() {
  const { router, get, post } = BaseRouter()
  const controller = new EditAlertTypeController()

  get('/', controller.GET)
  post('/', validate(schema), controller.POST)

  return router
}
