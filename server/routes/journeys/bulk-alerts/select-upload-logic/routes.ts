import BaseRouter from '../../../common/routes'
import { validate } from '../../../../middleware/validationMiddleware'
import { schema } from './schemas'
import SelectUploadLogicController from './controller'

export default function SelectUploadLogicRoutes() {
  const { router, get, post } = BaseRouter()
  const controller = new SelectUploadLogicController()

  get('/', controller.GET)
  post('/', validate(schema), controller.POST)

  return router
}
