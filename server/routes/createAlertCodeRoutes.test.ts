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
describe('createAlertCodeRoutes', () => {
  it('GET /alertCode/alertCode should render', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
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
    sessionSetup.sessionDoctor = (req: Request) => {
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
  it('GET /alertCode/alertCode should render', () => {
    return request(app)
      .get('/alertCode/alertCode')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Add alert code details')
      })
  })
  it('POST /alertCode/alertCode should redirect', () => {
    return request(app)
      .post('/alertCode/alertCode')
      .type('form')
      .send({ alertCode: 'DB', alertDescription: 'A description' })
      .expect(302)
      .expect('Location', '/alertCode/confirmation')
  })
  it('POST /alertCode/alertCode should render both errors if no fields entered', () => {
    return request(app)
      .post('/alertCode/alertCode')
      .type('form')
      .send({})
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('An alert code must be between 1 and 12 characters')
        expect(res.text).toContain('An alert description must be between 1 and 40 characters')
      })
  })
  it('POST /alertCode/alertCode should render code error if no code entered', () => {
    return request(app)
      .post('/alertCode/alertCode')
      .type('form')
      .send({ alertCode: '', alertDescription: 'A description' })
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('An alert code must be between 1 and 12 characters')
        expect(res.text).toContain('A description')
        expect(res.text).not.toContain('An alert description must be between 1 and 40 characters')
      })
  })
  it('POST /alertCode/alertCode should render description error if no description entered', () => {
    return request(app)
      .post('/alertCode/alertCode')
      .type('form')
      .send({ alertCode: 'DB', alertDescription: '' })
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).not.toContain('An alert code must be between 1 and 12 characters')
        expect(res.text).toContain('An alert description must be between 1 and 40 characters')
        expect(res.text).toContain('DB')
      })
  })
})