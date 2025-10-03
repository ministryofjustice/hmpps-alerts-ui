import { Router } from 'express'
import { dataAccess } from '../data'
import AddAnyAlertRoutes from './add-any-alert/routes'
import ManageReferenceDataRoutes from './manage-reference-data/routes'
import insertJourneyIdentifier from '../middleware/insertJourneyIdentifier'
import JourneyRoutes from './journeys/routes'
import removeTrailingSlashMiddleware from '../middleware/removeTrailingSlashMiddleware'
import { Services } from '../services'

export default function routes(services: Services): Router {
  const router = Router()
  const apiClient = dataAccess()
  const { alertsApiClient, prisonerSearchApiClient } = apiClient

  router.get('/', async (_req, res) => {
    res.render('view', { roles: res.locals.user.userRoles })
  })

  router.get('/error-page', (req, res) => {
    const { errorMessage } = req.session
    res.render('pages/errorPage', { errorMessage })
  })

  router.use(removeTrailingSlashMiddleware)

  router.use('/manage-reference-data', ManageReferenceDataRoutes())
  router.use('/add-any-alert', AddAnyAlertRoutes(alertsApiClient, prisonerSearchApiClient, services.auditService))

  router.use(insertJourneyIdentifier())
  router.use('/:journeyId', JourneyRoutes(apiClient, services))

  return router
}
