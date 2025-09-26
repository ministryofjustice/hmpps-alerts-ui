import express, { type Router } from 'express'

import {
  type EndpointHealthComponentOptions,
  endpointHealthComponent,
  monitoringMiddleware,
} from '@ministryofjustice/hmpps-monitoring'
import type { ApplicationInfo } from '../applicationInfo'
import config from '../config'
import logger from '../../logger'

export default function setUpHealthChecks(applicationInfo: ApplicationInfo): Router {
  const router = express.Router()

  const apiConfig = Object.entries(config.apis)

  const middleware = monitoringMiddleware({
    applicationInfo,
    healthComponents: apiConfig
      .filter(([_, options]) => 'healthPath' in options && options.healthPath && 'url' in options && options.url)
      .map(([name, options]) => endpointHealthComponent(logger, name, options as EndpointHealthComponentOptions)),
  })

  router.get('/health', middleware.health)
  router.get('/info', middleware.info)
  router.get('/ping', middleware.ping)

  return router
}
