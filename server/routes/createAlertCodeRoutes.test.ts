import { Express } from 'express'
import request from 'supertest'
import nock from 'nock'
import { appWithAllRoutes } from './testutils/appSetup'
import SessionSetup from './testutils/sessionSetup'
import config from '../config'
import { AlertType } from '../@types/alerts/alertsApiTypes'

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
describe('createAlertCodeRoutes', () => {
  it('GET /alertType/create should render', () => {
    sessionSetup.sessionDoctor = req => {
      req.middleware = {}
      req.middleware.clientToken = '123'
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .get('/alertCode/create')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Create an alert code')
        expect(res.text).toContain('Select an alert type')
        expect(res.text).toContain('Victim')
      })
  })
  it('POST /alertCode/create should redirect', () => {
    sessionSetup.sessionDoctor = req => {
      req.middleware = {}
      req.middleware.clientToken = '123'
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .post('/alertCode/create')
      .type('form')
      .send({ alertType: 'DB' })
      .expect(302)
      .expect('Location', '/alertCode/alertCode')
  })
  it('GET /alertCode/alertCode should redirect', () => {
    return request(app)
      .get('/alertCode/alertCode')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Add alert code details')
      })
  })
})
