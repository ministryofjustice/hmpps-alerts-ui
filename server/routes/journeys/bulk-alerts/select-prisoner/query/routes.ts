import BaseRouter from '../../../../common/routes'
import SelectPrisonerQueryController from './controller'
import { validate } from '../../../../../middleware/validationMiddleware'
import { schema } from './schemas'

export default function SelectPrisonerQueryRoutes() {
  const { router, post } = BaseRouter()
  const controller = new SelectPrisonerQueryController()

  post('/', validate(schema, '../select-prisoner'), controller.POST)

  return router
}
