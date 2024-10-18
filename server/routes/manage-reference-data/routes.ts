import BaseRouter from '../common/routes'
import authorisationMiddleware from '../../middleware/authorisationMiddleware'
import AuthorisedRoles from '../../authentication/authorisedRoles'

export default function ManageReferenceDataRoutes() {
  const { router, get } = BaseRouter()

  router.use(authorisationMiddleware([AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER], false))

  get('/', (req, res) => {
    req.session.alertTypeCode = ''
    req.session.alertTypeDescription = ''
    req.session.alertCodeParentType = ''
    req.session.alertCode = ''
    req.session.alertDescription = ''
    res.render('manage-reference-data/view')
  })

  return router
}
