/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { buildAppInsightsClient, initialiseAppInsights } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'
import TokenStore from './tokenStore/tokenStore'
import HmppsAuthClient, { systemTokenBuilder } from './hmppsAuthClient'
import ManageUsersApiClient from './manageUsersApiClient'
import { createRedisClient } from './redisClient'
import AlertsApiClient from './alertsApiClient'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
buildAppInsightsClient(applicationInfo)

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => ({
  applicationInfo,
  hmppsAuthClient: new HmppsAuthClient(new TokenStore(createRedisClient())),
  manageUsersApiClient: new ManageUsersApiClient(),
  systemToken: systemTokenBuilder(new TokenStore(createRedisClient())),
  alertsApiClient: new AlertsApiClient(),
})

export type DataAccess = typeof dataAccess

export { HmppsAuthClient, RestClientBuilder, ManageUsersApiClient }
