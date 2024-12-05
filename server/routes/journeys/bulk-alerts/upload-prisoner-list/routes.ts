import BaseRouter from '../../../common/routes'
import { validateFileAndSubmitPrisonerList } from './schemas'
import UploadPrisonerListController from './controller'
import setUpMultipartFormDataParsing from '../../../../middleware/setUpMultipartFormDataParsing'
import overrideTimeoutMiddleware from '../../../../middleware/overrideTimeoutMiddleware'
import AlertsApiClient from '../../../../data/alertsApiClient'

export default function UploadPrisonerListRoutes(alertsApiClient: AlertsApiClient) {
  const { router, get, post } = BaseRouter()
  const controller = new UploadPrisonerListController()

  get('/', controller.GET)
  post(
    '/',
    overrideTimeoutMiddleware(5 * 60),
    setUpMultipartFormDataParsing(),
    validateFileAndSubmitPrisonerList(alertsApiClient, 'upload-prisoner-list'),
    controller.POST,
  )

  return router
}
