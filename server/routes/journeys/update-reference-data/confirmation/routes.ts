import BaseRouter from '../../../common/routes'
import UpdateReferenceDataConfirmationController from './controller'

export default function UpdateReferenceDataConfirmationRoutes() {
  const { router, get } = BaseRouter()
  const controller = new UpdateReferenceDataConfirmationController()

  get('/', controller.GET)

  return router
}
