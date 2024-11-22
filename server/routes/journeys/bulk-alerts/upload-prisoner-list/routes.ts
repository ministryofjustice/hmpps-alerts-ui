import BaseRouter from '../../../common/routes'
import { validateFile } from './schemas'
import UploadPrisonerListController from './controller'
import PrisonerSearchApiClient from '../../../../data/prisonerSearchApiClient'
import setUpMultipartFormDataParsing from '../../../../middleware/setUpMultipartFormDataParsing'
import overrideTimeoutMiddleware from '../../../../middleware/overrideTimeoutMiddleware'

export default function UploadPrisonerListRoutes(prisonerSearchApiClient: PrisonerSearchApiClient) {
  const { router, get, post } = BaseRouter()
  const controller = new UploadPrisonerListController()

  get('/', controller.GET)
  post(
    '/',
    overrideTimeoutMiddleware(5 * 60),
    setUpMultipartFormDataParsing(),
    validateFile(prisonerSearchApiClient, 'upload-prisoner-list'),
    controller.POST,
  )

  return router
}
