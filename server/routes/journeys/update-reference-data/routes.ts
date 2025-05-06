import BaseRouter from '../../common/routes'
import authorisationMiddleware from '../../../middleware/authorisationMiddleware'
import AuthorisedRoles from '../../../authentication/authorisedRoles'
import { validate } from '../../../middleware/validationMiddleware'
import { schema } from './schemas'
import redirectCheckAnswersMiddleware from '../../../middleware/redirectCheckAnswersMiddleware'
import UpdateReferenceDataController from './controller'

export default function UpdateReferenceDataRoutes() {
  const { router, get, post } = BaseRouter()
  const controller = new UpdateReferenceDataController()

  router.use(authorisationMiddleware([AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER], false))

  router.use(redirectCheckAnswersMiddleware([/check-answers$/, /cancellation-check$/]))

  get('/', controller.GET)
  post('/', validate(schema), controller.POST)

  router.get('*any', (req, res, next) => {
    const { referenceDataType } = req.journeyData.updateRefData!
    if (referenceDataType) {
      res.locals.auditEvent.subjectType = referenceDataType
    }
    next()
  })

  return router
}
