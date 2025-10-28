import { Router } from 'express'
import { dataAccess } from '../data'
import AddAnyAlertRoutes from './add-any-alert/routes'
import insertJourneyIdentifier from '../middleware/insertJourneyIdentifier'
import JourneyRoutes from './journeys/routes'
import removeTrailingSlashMiddleware from '../middleware/removeTrailingSlashMiddleware'
import { Services } from '../services'
import DeleteAlertRoutes from './delete-alert/routes'

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

  router.use('/add-any-alert', AddAnyAlertRoutes(alertsApiClient, prisonerSearchApiClient, services.auditService))

  router.use('/delete-alert', DeleteAlertRoutes(alertsApiClient, services.auditService))

  router.use(insertJourneyIdentifier())
  router.use('/:journeyId', JourneyRoutes(apiClient, services))

  return router
}
