import { Request, type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import CreateAlertTypeRoutes from './createAlertTypeRoutes'
import { dataAccess } from '../data'
import CreateAlertCodeRoutes from './createAlertCodeRoutes'
import DeactivateAlertCodeRoutes from './deactivateAlertCodeRoutes'
import UpdateAlertTypeRoutes from './updateAlertTypeRoutes'
import DeactivateAlertTypeRoutes from './deactivateAlertTypeRoutes'
import UpdateAlertCodeRoutes from './updateAlertCodeRoutes'
import ReactivateAlertTypeRoutes from './reactivteAlertTypeRoutes'
import ReactivateAlertCodeRoutes from './reactivateAlertCodeRoutes'
import { Page } from '../services/auditService'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({ auditService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))
  const { alertsApiClient } = dataAccess()
  const createAlertTypeRoutes = new CreateAlertTypeRoutes(alertsApiClient)
  const updateAlertTypeRoutes = new UpdateAlertTypeRoutes(alertsApiClient)
  const createAlertCodeRoutes = new CreateAlertCodeRoutes(alertsApiClient)
  const updateAlertCodeRoutes = new UpdateAlertCodeRoutes(alertsApiClient)
  const deactivateAlertCodeRoutes = new DeactivateAlertCodeRoutes(alertsApiClient)
  const reactivateAlertCodeRoutes = new ReactivateAlertCodeRoutes(alertsApiClient)
  const deactivateAlertTypeRoutes = new DeactivateAlertTypeRoutes(alertsApiClient)
  const reactivateAlertTypeRoutes = new ReactivateAlertTypeRoutes(alertsApiClient)

  const resetSessionData = (req: Request) => {
    req.session.alertTypeCode = ''
    req.session.alertTypeDescription = ''
    req.session.alertCodeParentType = ''
    req.session.alertCode = ''
    req.session.alertDescription = ''
  }

  get('/', async (req, res, next) => {
    // sample function call for the new AuditService. disabled by default.
    await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })

    const { userRoles: roles } = res.locals.user
    resetSessionData(req)
    res.render('pages/index', { roles })
  })
  get('/error-page', (req, res, next) => {
    const { errorMessage } = req.session
    res.render('pages/errorPage', { errorMessage })
  })

  const createAlertType = () => {
    get('/alert-type/create', createAlertTypeRoutes.startPage)
    post('/alert-type/create', createAlertTypeRoutes.submitAlertType)
    get('/alert-type/confirmation', createAlertTypeRoutes.loadConfirmation)
    post('/alert-type/confirmation', createAlertTypeRoutes.submitConfirmation)
    get('/alert-type/success', createAlertTypeRoutes.loadSuccess)
  }

  const updateAlertType = () => {
    get('/alert-type/update-description', updateAlertTypeRoutes.startPage)
    post('/alert-type/update-description', updateAlertTypeRoutes.storeAlertType)
    get('/alert-type/update-description/submit-description', updateAlertTypeRoutes.loadSubmitDescription)
    post('/alert-type/update-description/submit-description', updateAlertTypeRoutes.saveSubmitDescription)
    get('/alert-type/update-description/confirmation', updateAlertTypeRoutes.loadConfirmation)
    post('/alert-type/update-description/confirmation', updateAlertTypeRoutes.submitConfirmationPage)
    get('/alert-type/update-description/success', updateAlertTypeRoutes.loadSuccess)
  }

  const createAlertCode = () => {
    get('/alert-code/create', createAlertCodeRoutes.startPage)
    post('/alert-code/create', createAlertCodeRoutes.submitAlertType)
    get('/alert-code/alert-code', createAlertCodeRoutes.loadAlertCode)
    post('/alert-code/alert-code', createAlertCodeRoutes.submitAlertCode)
    get('/alert-code/confirmation', createAlertCodeRoutes.loadConfirmation)
    post('/alert-code/confirmation', createAlertCodeRoutes.submitConfirmation)
    get('/alert-code/success', createAlertCodeRoutes.loadSuccess)
  }

  const updateAlertCode = () => {
    get('/alert-code/update-description', updateAlertCodeRoutes.startPage)
    post('/alert-code/update-description', updateAlertCodeRoutes.storeAlertType)
    get('/alert-code/update-description/alert-code', updateAlertCodeRoutes.loadSelectAlertCode)
    post('/alert-code/update-description/alert-code', updateAlertCodeRoutes.saveSelectAlertCode)
    get('/alert-code/update-description/submit-description', updateAlertCodeRoutes.loadSubmitDescription)
    post('/alert-code/update-description/submit-description', updateAlertCodeRoutes.saveSubmitDescription)
    get('/alert-code/update-description/confirmation', updateAlertCodeRoutes.loadConfirmation)
    post('/alert-code/update-description/confirmation', updateAlertCodeRoutes.submitConfirmationPage)
    get('/alert-code/update-description/success', updateAlertCodeRoutes.loadSuccess)
  }

  const deactivateAlertCode = () => {
    get('/alert-code/deactivate', deactivateAlertCodeRoutes.startPage)
    post('/alert-code/deactivate', deactivateAlertCodeRoutes.submitStartPage)
    get('/alert-code/deactivate/alert-code', deactivateAlertCodeRoutes.loadAlertCodesPage)
    post('/alert-code/deactivate/alert-code', deactivateAlertCodeRoutes.submitAlertCodesPage)
    get('/alert-code/deactivate/confirmation', deactivateAlertCodeRoutes.loadConfirmationPage)
    post('/alert-code/deactivate/confirmation', deactivateAlertCodeRoutes.submitConfirmationPage)
    get('/alert-code/deactivate/success', deactivateAlertCodeRoutes.loadSuccessPage)
  }

  const reactivateAlertCode = () => {
    get('/alert-code/reactivate', reactivateAlertCodeRoutes.startPage)
    post('/alert-code/reactivate', reactivateAlertCodeRoutes.submitStartPage)
    get('/alert-code/reactivate/alert-code', reactivateAlertCodeRoutes.loadAlertCodesPage)
    post('/alert-code/reactivate/alert-code', reactivateAlertCodeRoutes.submitAlertCodesPage)
    get('/alert-code/reactivate/confirmation', reactivateAlertCodeRoutes.loadConfirmationPage)
    post('/alert-code/reactivate/confirmation', reactivateAlertCodeRoutes.submitConfirmationPage)
    get('/alert-code/reactivate/success', reactivateAlertCodeRoutes.loadSuccessPage)
  }

  const deactivateAlertType = () => {
    get('/alert-type/deactivate', deactivateAlertTypeRoutes.startPage)
    post('/alert-type/deactivate', deactivateAlertTypeRoutes.submitStartPage)
    get('/alert-type/deactivate/confirmation', deactivateAlertTypeRoutes.loadConfirmationPage)
    post('/alert-type/deactivate/confirmation', deactivateAlertTypeRoutes.submitConfirmationPage)
    get('/alert-type/deactivate/success', deactivateAlertTypeRoutes.loadSuccessPage)
  }

  const reactivateAlertType = () => {
    get('/alert-type/reactivate', reactivateAlertTypeRoutes.startPage)
    post('/alert-type/reactivate', reactivateAlertTypeRoutes.submitStartPage)
    get('/alert-type/reactivate/confirmation', reactivateAlertTypeRoutes.loadConfirmationPage)
    post('/alert-type/reactivate/confirmation', reactivateAlertTypeRoutes.submitConfirmationPage)
    get('/alert-type/reactivate/success', reactivateAlertTypeRoutes.loadSuccessPage)
  }
  createAlertType()
  updateAlertType()
  createAlertCode()
  updateAlertCode()
  deactivateAlertCode()
  reactivateAlertCode()
  deactivateAlertType()
  reactivateAlertType()

  return router
}
