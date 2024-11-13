import BaseRouter from '../../../common/routes'
import { validateFile } from './schemas'
import UploadPrisonerListController from './controller'
import PrisonerSearchApiClient from '../../../../data/prisonerSearchApiClient'
import setUpMultipartFormDataParsing from '../../../../middleware/setUpMultipartFormDataParsing'

export default function UploadPrisonerListRoutes(prisonerSearchApiClient: PrisonerSearchApiClient) {
  const { router, get, post } = BaseRouter()
  const controller = new UploadPrisonerListController()

  get('/', controller.GET)
  post(
    '/',
    setUpMultipartFormDataParsing(),
    validateFile(prisonerSearchApiClient, 'upload-prisoner-list'),
    controller.POST,
  )

  return router
}
