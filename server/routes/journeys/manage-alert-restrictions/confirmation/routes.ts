import BaseRouter from '../../../common/routes'
import ManageAlertRestrictionConfirmationController from './controller'

export default function ManageAlertRestrictionConfirmationRoutes() {
  const { router, get } = BaseRouter()
  const controller = new ManageAlertRestrictionConfirmationController()

  get('/', controller.GET)

  return router
}
