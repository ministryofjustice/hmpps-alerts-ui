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
const alertTypes = [
  {
    code: 'VI',
    description: 'Victim',
    alertCodes: [{ code: 'AA', description: 'Alert code' }],
  } as AlertType,
  {
    code: 'AA',
    description: 'A type',
  } as AlertType,
]

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
  it('POST /alertCode/deactivate should redirect', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .post('/alertCode/deactivate')
      .type('form')
      .send({ alertType: 'DB' })
      .expect(302)
      .expect('Location', '/alertCode/deactivate/alertCode')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('GET /alertCode/deactivate/alertCode should render', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertTypeCode = 'VI'
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .get('/alertCode/deactivate/alertCode')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Deactivate an alert code')
        expect(res.text).toContain('Select an alert code')
        expect(res.text).toContain('Alert code')
      })
  })
  it('GET /alertCode/deactivate/alertCode no codes should redirect', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertTypeCode = 'AA'
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .get('/alertCode/deactivate/alertCode')
      .expect(302)
      .expect('Location', '/errorPage')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
})
