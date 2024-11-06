import { Router } from 'express'
import { DataAccess } from '../../data'
import BulkAlertsRoutes from './bulk-alerts/routes'

export default function JourneyRoutes(dataAccess: DataAccess) {
  const router = Router({ mergeParams: true })

  router.use('/bulk-alerts', BulkAlertsRoutes(dataAccess))

  return router
}
