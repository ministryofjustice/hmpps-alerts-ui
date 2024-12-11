import express, { Express } from 'express'
import { NotFound } from 'http-errors'
import { v4 as uuidv4 } from 'uuid'

import dpsComponents from '@ministryofjustice/hmpps-connect-dps-components'
import flash from 'connect-flash'
import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import type { Services } from '../../services'
import AuditService from '../../services/auditService'
import { HmppsUser } from '../../interfaces/hmppsUser'
import setUpWebSession from '../../middleware/setUpWebSession'
import SessionSetup from './sessionSetup'
import logger from '../../../logger'
import config from '../../config'
import populateValidationErrors from '../../middleware/populateValidationErrors'
import { HmppsAuditClient } from '../../data'

jest.mock('../../services/auditService')

export const user: HmppsUser = {
  name: 'FIRST LAST',
  userId: 'id',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkZpcnN0IExhc3QiLCJpYXQiOjE1MTYyMzkwMjIsImF1dGhvcml0aWVzIjpbIlJPTEVfQUxFUlRTX1JFRkVSRU5DRV9EQVRBX01BTkFHRVIiLCJST0xFX01BTkFHRV9TRUNVUkVfQUxFUlRTIl19.GhXs8pD74dIh8nl6O9RWbAKrDok-wWqPydhQl9qnUxw',
  username: 'user1',
  displayName: 'First Last',
  authSource: 'nomis',
  staffId: 1234,
  userRoles: ['ROLE_ALERTS_REFERENCE_DATA_MANAGER', 'ROLE_BULK_PRISON_ESTATE_ALERTS'],
  caseloads: [],
}

function appSetup(
  _services: Services,
  production: boolean,
  userSupplier: () => HmppsUser,
  sessionSetup: SessionSetup = new SessionSetup(),
): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app)
  app.use(setUpWebSession())
  app.use(flash())
  app.use((req, res, next) => {
    req.user = userSupplier() as Express.User
    res.locals = {
      ...res.locals,
      user: { ...req.user } as HmppsUser,
    }
    sessionSetup.sessionDoctor(req)
    next()
  })
  app.use((req, _res, next) => {
    req.id = uuidv4()
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(populateValidationErrors())
  app.get(
    '*',
    dpsComponents.getPageComponents({
      logger,
      includeMeta: true,
      dpsUrl: config.serviceUrls.digitalPrison,
      timeoutOptions: { response: 50, deadline: 50 },
    }),
  )
  app.use(routes())
  app.use((_req, _res, next) => next(new NotFound()))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = {
    auditService: new AuditService(null as unknown as HmppsAuditClient) as jest.Mocked<AuditService>,
  },
  userSupplier = () => user,
  sessionSetup = new SessionSetup(),
}: {
  production?: boolean
  services?: Partial<Services>
  sessionSetup?: SessionSetup
  userSupplier?: () => HmppsUser
}): Express {
  return appSetup(services as Services, production, userSupplier, sessionSetup)
}
