import BaseRouter from '../common/routes'
import authorisationMiddleware from '../../middleware/authorisationMiddleware'
import AuthorisedRoles from '../../authentication/authorisedRoles'

export default function ManageReferenceDataRoutes() {
  const { router, get } = BaseRouter()

  router.use(authorisationMiddleware([AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER], false))

  get('/', (_req, res) => {
    res.render('manage-reference-data/view')
  })

  return router
}
