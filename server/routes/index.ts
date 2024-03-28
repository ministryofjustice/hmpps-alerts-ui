import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import CreateAlertTypeRoutes from './createAlertTypeRoutes'
import { dataAccess } from '../data'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(service: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))
  const { alertsApiClient } = dataAccess()
  const createAlertTypeRoutes = new CreateAlertTypeRoutes(alertsApiClient)
  get('/', (req, res, next) => {
    const { roles } = res.locals.user
    res.render('pages/index', { roles })
  })
  get('/alertType/create', createAlertTypeRoutes.startPage)
  post('/alertType/create', createAlertTypeRoutes.submitAlertType)
  get('/alertType/confirmation', createAlertTypeRoutes.loadConfirmation)
  post('/alertType/confirmation', createAlertTypeRoutes.submitConfirmation)
  get('/alertType/success', createAlertTypeRoutes.loadSuccess)
  return router
}
