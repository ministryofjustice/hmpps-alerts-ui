import { RequestHandler, Router } from 'express'
import { dataAccess } from '../data'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import AddAnyAlertRoutes from './add-any-alert/routes'
import ManageReferenceDataRoutes from './manage-reference-data/routes'
import insertJourneyIdentifier from '../middleware/insertJourneyIdentifier'
import JourneyRoutes from './journeys/routes'
import removeTrailingSlashMiddleware from '../middleware/removeTrailingSlashMiddleware'

export default function routes({ auditService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const apiClient = dataAccess()
  const { alertsApiClient, prisonerSearchApiClient } = apiClient

  get('/', async (req, res) => {
    // sample function call for the new AuditService. disabled by default.
    await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })
    res.render('view', { roles: res.locals.user.userRoles })
  })

  get('/error-page', (req, res) => {
    const { errorMessage } = req.session
    res.render('pages/errorPage', { errorMessage })
  })

  router.use(removeTrailingSlashMiddleware)

  router.use('/manage-reference-data', ManageReferenceDataRoutes())
  router.use('/add-any-alert', AddAnyAlertRoutes(alertsApiClient, prisonerSearchApiClient))

  router.use(insertJourneyIdentifier())
  router.use('/:journeyId', JourneyRoutes(apiClient))

  return router
}
