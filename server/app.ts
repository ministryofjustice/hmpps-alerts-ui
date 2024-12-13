import express from 'express'
import dpsComponents from '@ministryofjustice/hmpps-connect-dps-components'
import * as Sentry from '@sentry/node'
import createError from 'http-errors'
// @ts-expect-error Import untyped middleware for cypress coverage
import cypressCoverage from '@cypress/code-coverage/middleware/express'
import './sentry'
import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import { appInsightsMiddleware } from './utils/azureAppInsights'
import authorisationMiddleware from './middleware/authorisationMiddleware'

import setUpAuthentication from './middleware/setUpAuthentication'
import setUpCsrf from './middleware/setUpCsrf'
import setUpCurrentUser from './middleware/setUpCurrentUser'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'
import { auditPageViewMiddleware } from './middleware/auditPageViewMiddleware'

import routes from './routes'
import type { Services } from './services'
import AuthorisedRoles from './authentication/authorisedRoles'
import populateClientToken from './middleware/populateClientToken'
import logger from '../logger'
import config from './config'
import populateValidationErrors from './middleware/populateValidationErrors'
import checkPopulateUserCaseloads from './middleware/checkPopulateUserCaseloads'
import sentryMiddleware from './middleware/sentryMiddleware'

export default function createApp(services: Services): express.Application {
  const app = express()

  if (process.env.NODE_ENV === 'e2e-test') {
    cypressCoverage(app)
  }

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(sentryMiddleware())
  app.use(appInsightsMiddleware())
  app.use(setUpHealthChecks(services.applicationInfo))
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  nunjucksSetup(app)
  app.use(setUpAuthentication())
  app.get('*', auditPageViewMiddleware(services.auditService))
  app.use(authorisationMiddleware(Object.values(AuthorisedRoles)))
  app.use(setUpCsrf())
  app.use(setUpCurrentUser())
  app.use(populateClientToken())
  app.use(populateValidationErrors())

  app.get(
    '*',
    dpsComponents.getPageComponents({
      logger,
      includeMeta: true,
      dpsUrl: config.serviceUrls.digitalPrison,
      timeoutOptions: {
        response: config.apis.componentApi.timeout.response,
        deadline: config.apis.componentApi.timeout.deadline,
      },
    }),
  )

  app.use(checkPopulateUserCaseloads())

  app.use(routes(services))

  if (config.sentry.dsn) Sentry.setupExpressErrorHandler(app)

  app.use((_req, _res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
