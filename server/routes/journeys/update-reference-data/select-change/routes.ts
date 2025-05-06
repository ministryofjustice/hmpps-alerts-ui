import BaseRouter from '../../../common/routes'
import { validate } from '../../../../middleware/validationMiddleware'
import { schema } from './schemas'
import SelectChangeController from './controller'

export default function SelectChangeRoutes() {
  const { router, get, post } = BaseRouter()
  const controller = new SelectChangeController()

  get('/', controller.GET)
  post('/', validate(schema), controller.POST)

  return router
}
