import BaseRouter from '../../../common/routes'
import BulkAlertsCancellationCheckController from './controller'

export default function BulkAlertsCancellationCheckRoutes() {
  const { router, get, post } = BaseRouter()
  const controller = new BulkAlertsCancellationCheckController()

  get('/', controller.GET)
  post('/', controller.POST)

  return router
}
