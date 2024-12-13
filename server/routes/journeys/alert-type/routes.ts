import { type RequestHandler, Router } from 'express'
import AlertsApiClient from '../../../data/alertsApiClient'

import asyncMiddleware from '../../../middleware/asyncMiddleware'
import CreateAlertTypeRoutes from './create/createAlertTypeRoutes'
import UpdateAlertTypeRoutes from './update-description/updateAlertTypeRoutes'
import DeactivateAlertTypeRoutes from './deactivate/deactivateAlertTypeRoutes'
import ReactivateAlertTypeRoutes from './reactivate/reactivteAlertTypeRoutes'
import authorisationMiddleware from '../../../middleware/authorisationMiddleware'
import AuthorisedRoles from '../../../authentication/authorisedRoles'
import AuditService from '../../../services/auditService'

export default function AlertTypeRoutes(alertsApiClient: AlertsApiClient, auditService: AuditService) {
  const router = Router({ mergeParams: true })
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const createAlertTypeRoutes = new CreateAlertTypeRoutes(alertsApiClient, auditService)
  const updateAlertTypeRoutes = new UpdateAlertTypeRoutes(alertsApiClient, auditService)
  const deactivateAlertTypeRoutes = new DeactivateAlertTypeRoutes(alertsApiClient, auditService)
  const reactivateAlertTypeRoutes = new ReactivateAlertTypeRoutes(alertsApiClient, auditService)

  router.use(authorisationMiddleware([AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER], false))

  // createAlertType
  get('/create', createAlertTypeRoutes.startPage)
  post('/create', createAlertTypeRoutes.submitAlertType)
  get('/confirmation', createAlertTypeRoutes.loadConfirmation)
  post('/confirmation', createAlertTypeRoutes.submitConfirmation)
  get('/success', createAlertTypeRoutes.loadSuccess)

  // updateAlertType
  get('/update-description', updateAlertTypeRoutes.startPage)
  post('/update-description', updateAlertTypeRoutes.storeAlertType)
  get('/update-description/submit-description', updateAlertTypeRoutes.loadSubmitDescription)
  post('/update-description/submit-description', updateAlertTypeRoutes.saveSubmitDescription)
  get('/update-description/confirmation', updateAlertTypeRoutes.loadConfirmation)
  post('/update-description/confirmation', updateAlertTypeRoutes.submitConfirmationPage)
  get('/update-description/success', updateAlertTypeRoutes.loadSuccess)

  // deactivateAlertType
  get('/deactivate', deactivateAlertTypeRoutes.startPage)
  post('/deactivate', deactivateAlertTypeRoutes.submitStartPage)
  get('/deactivate/confirmation', deactivateAlertTypeRoutes.loadConfirmationPage)
  post('/deactivate/confirmation', deactivateAlertTypeRoutes.submitConfirmationPage)
  get('/deactivate/success', deactivateAlertTypeRoutes.loadSuccessPage)

  // reactivateAlertType
  get('/reactivate', reactivateAlertTypeRoutes.startPage)
  post('/reactivate', reactivateAlertTypeRoutes.submitStartPage)
  get('/reactivate/confirmation', reactivateAlertTypeRoutes.loadConfirmationPage)
  post('/reactivate/confirmation', reactivateAlertTypeRoutes.submitConfirmationPage)
  get('/reactivate/success', reactivateAlertTypeRoutes.loadSuccessPage)

  return router
}
