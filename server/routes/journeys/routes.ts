import { Router } from 'express'
import { DataAccess } from '../../data'
import BulkAlertsRoutes from './bulk-alerts/routes'
import journeyStateMachine from '../../middleware/journeyStateMachine'
import setUpJourneyData from '../../middleware/setUpJourneyData'
import { Services } from '../../services'
import UpdateReferenceDataRoutes from './update-reference-data/routes'
import ManageAlertRestrictionRoutes from './manage-alert-restrictions/routes'

export default function JourneyRoutes(dataAccess: DataAccess, services: Services) {
  const router = Router({ mergeParams: true })

  router.use(setUpJourneyData(dataAccess.tokenStore))
  router.use(journeyStateMachine())

  router.use('/bulk-alerts', BulkAlertsRoutes(dataAccess, services))
  router.use('/update-reference-data', UpdateReferenceDataRoutes(dataAccess.alertsApiClient, services.auditService))
  router.use(
    '/manage-alert-restrictions',
    ManageAlertRestrictionRoutes(dataAccess.alertsApiClient, services.auditService),
  )

  if (process.env.NODE_ENV === 'e2e-test') {
    /* eslint-disable no-param-reassign */
    const mergeObjects = <T extends Record<string, unknown>>(destination: T, source: Partial<T>) => {
      Object.entries(source).forEach(([key, value]) => {
        if (typeof value === 'object' && !Array.isArray(value)) {
          if (!destination[key]) {
            // @ts-expect-error set up object for future recursive writes
            destination[key] = {}
          }
          mergeObjects(destination[key] as Record<string, unknown>, value)
        } else {
          // @ts-expect-error unexpected types
          destination[key] = value
        }
      })
    }

    router.get('/inject-journey-data', (req, res) => {
      const { data } = req.query
      const json = JSON.parse(atob(data as string))
      mergeObjects(req.journeyData, json)
      res.sendStatus(200)
    })
  }

  return router
}
