import { RequestHandler, Router } from 'express'
import { dataAccess } from '../data'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import AlertCodeRoutes from './alert-code/routes'
import AlertTypeRoutes from './alert-type/routes'
import AddAnyAlertRoutes from './add-any-alert/routes'
import ManageReferenceDataRoutes from './manage-reference-data/routes'

export default function routes({ auditService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const { alertsApiClient, prisonerSearchApiClient } = dataAccess()

  get('/', async (req, res) => {
    // sample function call for the new AuditService. disabled by default.
    await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })
    res.render('view', { roles: res.locals.user.userRoles })
  })

  get('/error-page', (req, res) => {
    const { errorMessage } = req.session
    res.render('pages/errorPage', { errorMessage })
  })

  router.use('/manage-reference-data', ManageReferenceDataRoutes())
  router.use('/alert-code', AlertCodeRoutes(alertsApiClient))
  router.use('/alert-type', AlertTypeRoutes(alertsApiClient))
  router.use('/add-any-alert', AddAnyAlertRoutes(alertsApiClient, prisonerSearchApiClient))

  return router
}
