import { type RequestHandler, Router } from 'express'
import AlertsApiClient from '../../data/alertsApiClient'
import CreateAlertCodeRoutes from './create/createAlertCodeRoutes'
import UpdateAlertCodeRoutes from './update-description/updateAlertCodeRoutes'
import DeactivateAlertCodeRoutes from './deactivate/deactivateAlertCodeRoutes'
import ReactivateAlertCodeRoutes from './reactivate/reactivateAlertCodeRoutes'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import authorisationMiddleware from '../../middleware/authorisationMiddleware'
import AuthorisedRoles from '../../authentication/authorisedRoles'

export default function AlertCodeRoutes(alertsApiClient: AlertsApiClient) {
  const router = Router({ mergeParams: true })
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const createAlertCodeRoutes = new CreateAlertCodeRoutes(alertsApiClient)
  const updateAlertCodeRoutes = new UpdateAlertCodeRoutes(alertsApiClient)
  const deactivateAlertCodeRoutes = new DeactivateAlertCodeRoutes(alertsApiClient)
  const reactivateAlertCodeRoutes = new ReactivateAlertCodeRoutes(alertsApiClient)

  router.use(authorisationMiddleware([AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER], false))

  // createAlertCode
  get('/create', createAlertCodeRoutes.startPage)
  post('/create', createAlertCodeRoutes.submitAlertType)
  get('/alert-code', createAlertCodeRoutes.loadAlertCode)
  post('/alert-code', createAlertCodeRoutes.submitAlertCode)
  get('/confirmation', createAlertCodeRoutes.loadConfirmation)
  post('/confirmation', createAlertCodeRoutes.submitConfirmation)
  get('/success', createAlertCodeRoutes.loadSuccess)

  // updateAlertCode
  get('/update-description', updateAlertCodeRoutes.startPage)
  post('/update-description', updateAlertCodeRoutes.storeAlertType)
  get('/update-description/alert-code', updateAlertCodeRoutes.loadSelectAlertCode)
  post('/update-description/alert-code', updateAlertCodeRoutes.saveSelectAlertCode)
  get('/update-description/submit-description', updateAlertCodeRoutes.loadSubmitDescription)
  post('/update-description/submit-description', updateAlertCodeRoutes.saveSubmitDescription)
  get('/update-description/confirmation', updateAlertCodeRoutes.loadConfirmation)
  post('/update-description/confirmation', updateAlertCodeRoutes.submitConfirmationPage)
  get('/update-description/success', updateAlertCodeRoutes.loadSuccess)

  // deactivateAlertCode
  get('/deactivate', deactivateAlertCodeRoutes.startPage)
  post('/deactivate', deactivateAlertCodeRoutes.submitStartPage)
  get('/deactivate/alert-code', deactivateAlertCodeRoutes.loadAlertCodesPage)
  post('/deactivate/alert-code', deactivateAlertCodeRoutes.submitAlertCodesPage)
  get('/deactivate/confirmation', deactivateAlertCodeRoutes.loadConfirmationPage)
  post('/deactivate/confirmation', deactivateAlertCodeRoutes.submitConfirmationPage)
  get('/deactivate/success', deactivateAlertCodeRoutes.loadSuccessPage)

  // reactivateAlertCode
  get('/reactivate', reactivateAlertCodeRoutes.startPage)
  post('/reactivate', reactivateAlertCodeRoutes.submitStartPage)
  get('/reactivate/alert-code', reactivateAlertCodeRoutes.loadAlertCodesPage)
  post('/reactivate/alert-code', reactivateAlertCodeRoutes.submitAlertCodesPage)
  get('/reactivate/confirmation', reactivateAlertCodeRoutes.loadConfirmationPage)
  post('/reactivate/confirmation', reactivateAlertCodeRoutes.submitConfirmationPage)
  get('/reactivate/success', reactivateAlertCodeRoutes.loadSuccessPage)

  return router
}
