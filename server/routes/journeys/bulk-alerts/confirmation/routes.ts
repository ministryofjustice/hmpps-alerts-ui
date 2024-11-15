import BulkAlertsConfirmationController from './controller'
import BaseRouter from '../../../common/routes'

export default function BulkAlertsConfirmationRoutes() {
  const { router, get } = BaseRouter()
  const controller = new BulkAlertsConfirmationController()

  get('/', controller.GET)

  return router
}
