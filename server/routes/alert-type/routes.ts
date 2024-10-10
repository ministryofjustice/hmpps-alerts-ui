import { type RequestHandler, Router } from 'express'
import AlertsApiClient from '../../data/alertsApiClient'

import asyncMiddleware from '../../middleware/asyncMiddleware'
import CreateAlertTypeRoutes from './create/createAlertTypeRoutes'
import UpdateAlertTypeRoutes from './update-description/updateAlertTypeRoutes'
import DeactivateAlertTypeRoutes from './deactivate/deactivateAlertTypeRoutes'
import ReactivateAlertTypeRoutes from './reactivate/reactivteAlertTypeRoutes'

export default function AlertTypeRoutes(alertsApiClient: AlertsApiClient) {
  const router = Router({ mergeParams: true })
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const createAlertTypeRoutes = new CreateAlertTypeRoutes(alertsApiClient)
  const updateAlertTypeRoutes = new UpdateAlertTypeRoutes(alertsApiClient)
  const deactivateAlertTypeRoutes = new DeactivateAlertTypeRoutes(alertsApiClient)
  const reactivateAlertTypeRoutes = new ReactivateAlertTypeRoutes(alertsApiClient)

  // createAlertType
  get('/alert-type/create', createAlertTypeRoutes.startPage)
  post('/alert-type/create', createAlertTypeRoutes.submitAlertType)
  get('/alert-type/confirmation', createAlertTypeRoutes.loadConfirmation)
  post('/alert-type/confirmation', createAlertTypeRoutes.submitConfirmation)
  get('/alert-type/success', createAlertTypeRoutes.loadSuccess)

  // updateAlertType
  get('/alert-type/update-description', updateAlertTypeRoutes.startPage)
  post('/alert-type/update-description', updateAlertTypeRoutes.storeAlertType)
  get('/alert-type/update-description/submit-description', updateAlertTypeRoutes.loadSubmitDescription)
  post('/alert-type/update-description/submit-description', updateAlertTypeRoutes.saveSubmitDescription)
  get('/alert-type/update-description/confirmation', updateAlertTypeRoutes.loadConfirmation)
  post('/alert-type/update-description/confirmation', updateAlertTypeRoutes.submitConfirmationPage)
  get('/alert-type/update-description/success', updateAlertTypeRoutes.loadSuccess)

  // deactivateAlertType
  get('/alert-type/deactivate', deactivateAlertTypeRoutes.startPage)
  post('/alert-type/deactivate', deactivateAlertTypeRoutes.submitStartPage)
  get('/alert-type/deactivate/confirmation', deactivateAlertTypeRoutes.loadConfirmationPage)
  post('/alert-type/deactivate/confirmation', deactivateAlertTypeRoutes.submitConfirmationPage)
  get('/alert-type/deactivate/success', deactivateAlertTypeRoutes.loadSuccessPage)

  // reactivateAlertType
  get('/alert-type/reactivate', reactivateAlertTypeRoutes.startPage)
  post('/alert-type/reactivate', reactivateAlertTypeRoutes.submitStartPage)
  get('/alert-type/reactivate/confirmation', reactivateAlertTypeRoutes.loadConfirmationPage)
  post('/alert-type/reactivate/confirmation', reactivateAlertTypeRoutes.submitConfirmationPage)
  get('/alert-type/reactivate/success', reactivateAlertTypeRoutes.loadSuccessPage)

  return router
}
