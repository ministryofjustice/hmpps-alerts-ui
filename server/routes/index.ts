import { Request, type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import CreateAlertTypeRoutes from './createAlertTypeRoutes'
import { dataAccess } from '../data'
import CreateAlertCodeRoutes from './createAlertCodeRoutes'
import DeactivateAlertCodeRoutes from './deactivateAlertCodeRoutes'
import UpdateAlertTypeRoutes from './updateAlertTypeRoutes'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))
  const { alertsApiClient } = dataAccess()
  const createAlertTypeRoutes = new CreateAlertTypeRoutes(alertsApiClient)
  const updateAlertTypeRoutes = new UpdateAlertTypeRoutes(alertsApiClient)
  const createAlertCodeRoutes = new CreateAlertCodeRoutes(alertsApiClient)
  const deactivateAlertCodeRoutes = new DeactivateAlertCodeRoutes(alertsApiClient)
  const resetSessionData = (req: Request) => {
    req.session.alertTypeCode = ''
    req.session.alertTypeDescription = ''
    req.session.alertCodeParentType = ''
    req.session.alertCode = ''
    req.session.alertDescription = ''
  }

  get('/', (req, res, next) => {
    const { roles } = res.locals.user
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

  const deactivateAlertCode = () => {
    get('/alert-code/deactivate', deactivateAlertCodeRoutes.startPage)
    post('/alert-code/deactivate', deactivateAlertCodeRoutes.submitStartPage)
    get('/alert-code/deactivate/alert-code', deactivateAlertCodeRoutes.loadAlertCodesPage)
    post('/alert-code/deactivate/alert-code', deactivateAlertCodeRoutes.submitAlertCodesPage)
    get('/alert-code/deactivate/confirmation', deactivateAlertCodeRoutes.loadConfirmationPage)
    post('/alert-code/deactivate/confirmation', deactivateAlertCodeRoutes.submitConfirmationPage)
    get('/alert-code/deactivate/success', deactivateAlertCodeRoutes.loadSuccessPage)
  }

  createAlertType()
  updateAlertType()
  createAlertCode()
  deactivateAlertCode()
  return router
}
