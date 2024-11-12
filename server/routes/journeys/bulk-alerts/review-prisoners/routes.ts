import BaseRouter from '../../../common/routes'
import ReviewPrisonersController from './controller'

export default function ReviewPrisonersRoutes() {
  const { router, get, post } = BaseRouter()
  const controller = new ReviewPrisonersController()

  get('/', controller.GET)
  post('/', controller.POST)

  return router
}
