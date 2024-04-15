import { Express, Request } from 'express'
import request from 'supertest'
import nock from 'nock'
import { appWithAllRoutes } from './testutils/appSetup'
import config from '../config'
import { AlertType } from '../@types/alerts/alertsApiTypes'
import SessionSetup from './testutils/sessionSetup'

let app: Express
let sessionSetup: SessionSetup
let fakeApi: nock.Scope

beforeEach(() => {
  sessionSetup = new SessionSetup()
  config.apis.alertsApi.url = 'http://localhost:8100'
  fakeApi = nock(config.apis.alertsApi.url)
  app = appWithAllRoutes({
    services: {},
    sessionSetup,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})
const alertTypes = [{ code: 'VI', description: 'Victim' } as AlertType]

describe('deactivateAlertCode', () => {
  it('GET /alertCode/deactivate should render', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .get('/alertCode/deactivate')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Deactivate an alert code')
        expect(res.text).toContain(
          'Selecting an alert type will allow you to choose the code you are going to deactivate.',
        )
        expect(res.text).toContain('Select an alert type')
        expect(res.text).toContain('Victim')
      })
  })
})
