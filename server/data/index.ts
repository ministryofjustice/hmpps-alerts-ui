/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { AuthenticationClient, InMemoryTokenStore, RedisTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
buildAppInsightsClient(applicationInfo)

import { createRedisClient } from './redisClient'
import AlertsApiClient from './alertsApiClient'
import config from '../config'
import HmppsAuditClient from './hmppsAuditClient'
import PrisonerSearchApiClient from './prisonerSearchApiClient'
import logger from '../../logger'

const tokenStore = config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore()

const hmppsAuthClient = new AuthenticationClient(
  config.apis.hmppsAuth,
  logger,
  config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
)

export const dataAccess = () => ({
  applicationInfo,
  alertsApiClient: new AlertsApiClient(),
  prisonerSearchApiClient: new PrisonerSearchApiClient(),
  hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
  hmppsAuthClient,
  tokenStore,
})

export type DataAccess = ReturnType<typeof dataAccess>

export { HmppsAuditClient }
