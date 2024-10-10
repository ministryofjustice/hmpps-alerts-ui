import { type RequestHandler, Router } from 'express'
import AlertsApiClient from '../../data/alertsApiClient'
import CreateAlertCodeRoutes from './create/createAlertCodeRoutes'
import UpdateAlertCodeRoutes from './update-description/updateAlertCodeRoutes'
import DeactivateAlertCodeRoutes from './deactivate/deactivateAlertCodeRoutes'
import ReactivateAlertCodeRoutes from './reactivate/reactivateAlertCodeRoutes'
import asyncMiddleware from '../../middleware/asyncMiddleware'

export default function AlertCodeRoutes(alertsApiClient: AlertsApiClient) {
  const router = Router({ mergeParams: true })
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const createAlertCodeRoutes = new CreateAlertCodeRoutes(alertsApiClient)
  const updateAlertCodeRoutes = new UpdateAlertCodeRoutes(alertsApiClient)
  const deactivateAlertCodeRoutes = new DeactivateAlertCodeRoutes(alertsApiClient)
  const reactivateAlertCodeRoutes = new ReactivateAlertCodeRoutes(alertsApiClient)

  // createAlertCode
  get('/alert-code/create', createAlertCodeRoutes.startPage)
  post('/alert-code/create', createAlertCodeRoutes.submitAlertType)
  get('/alert-code/alert-code', createAlertCodeRoutes.loadAlertCode)
  post('/alert-code/alert-code', createAlertCodeRoutes.submitAlertCode)
  get('/alert-code/confirmation', createAlertCodeRoutes.loadConfirmation)
  post('/alert-code/confirmation', createAlertCodeRoutes.submitConfirmation)
  get('/alert-code/success', createAlertCodeRoutes.loadSuccess)

  // updateAlertCode
  get('/alert-code/update-description', updateAlertCodeRoutes.startPage)
  post('/alert-code/update-description', updateAlertCodeRoutes.storeAlertType)
  get('/alert-code/update-description/alert-code', updateAlertCodeRoutes.loadSelectAlertCode)
  post('/alert-code/update-description/alert-code', updateAlertCodeRoutes.saveSelectAlertCode)
  get('/alert-code/update-description/submit-description', updateAlertCodeRoutes.loadSubmitDescription)
  post('/alert-code/update-description/submit-description', updateAlertCodeRoutes.saveSubmitDescription)
  get('/alert-code/update-description/confirmation', updateAlertCodeRoutes.loadConfirmation)
  post('/alert-code/update-description/confirmation', updateAlertCodeRoutes.submitConfirmationPage)
  get('/alert-code/update-description/success', updateAlertCodeRoutes.loadSuccess)

  // deactivateAlertCode
  get('/alert-code/deactivate', deactivateAlertCodeRoutes.startPage)
  post('/alert-code/deactivate', deactivateAlertCodeRoutes.submitStartPage)
  get('/alert-code/deactivate/alert-code', deactivateAlertCodeRoutes.loadAlertCodesPage)
  post('/alert-code/deactivate/alert-code', deactivateAlertCodeRoutes.submitAlertCodesPage)
  get('/alert-code/deactivate/confirmation', deactivateAlertCodeRoutes.loadConfirmationPage)
  post('/alert-code/deactivate/confirmation', deactivateAlertCodeRoutes.submitConfirmationPage)
  get('/alert-code/deactivate/success', deactivateAlertCodeRoutes.loadSuccessPage)

  // reactivateAlertCode
  get('/alert-code/reactivate', reactivateAlertCodeRoutes.startPage)
  post('/alert-code/reactivate', reactivateAlertCodeRoutes.submitStartPage)
  get('/alert-code/reactivate/alert-code', reactivateAlertCodeRoutes.loadAlertCodesPage)
  post('/alert-code/reactivate/alert-code', reactivateAlertCodeRoutes.submitAlertCodesPage)
  get('/alert-code/reactivate/confirmation', reactivateAlertCodeRoutes.loadConfirmationPage)
  post('/alert-code/reactivate/confirmation', reactivateAlertCodeRoutes.submitConfirmationPage)
  get('/alert-code/reactivate/success', reactivateAlertCodeRoutes.loadSuccessPage)

  return router
}
