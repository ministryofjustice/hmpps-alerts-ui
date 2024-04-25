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
    isActive: true,
    alertCodes: [{ code: 'AA', description: 'Alert code' }],
  } as AlertType,
  {
    code: 'AA',
    description: 'A type',
    isActive: true,
  } as AlertType,
]

describe('deactivateAlertCode', () => {
  it('GET /alert-type/deactivate should render', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .get('/alert-type/deactivate')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Deactivate an alert type')
        expect(res.text).toContain('Select an alert type')
        expect(res.text).toContain('Victim')
      })
  })
  it('POST /alert-type/deactivate should redirect', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .post('/alert-type/deactivate')
      .type('form')
      .send({ alertType: 'DB' })
      .expect(302)
      .expect('Location', '/alert-type/deactivate/confirmation')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('GET /alert-type/deactivate/confirmation should render', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertType = 'VI'
    }
    return request(app)
      .get('/alert-type/deactivate/confirmation')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Deactivate an alert type')
        expect(res.text).toContain('Are you sure you want to deactivate alert type VI?')
      })
  })
  it('POST /alert-type/deactivate/confirmation with nothing selected should render error', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertType = 'VI'
    }
    return request(app)
      .post('/alert-type/deactivate/confirmation')
      .type('form')
      .send({})
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Deactivate an alert type')
        expect(res.text).toContain('You must select either Yes or No.')
        expect(res.text).toContain('Are you sure you want to deactivate alert type VI?')
      })
  })
  it('POST /alert-type/deactivate/confirmation with confirmation as an empty string should render error', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertType = 'VI'
    }
    return request(app)
      .post('/alert-type/deactivate/confirmation')
      .type('form')
      .send({ confirmation: '' })
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Deactivate an alert type')
        expect(res.text).toContain('You must select either Yes or No.')
        expect(res.text).toContain('Are you sure you want to deactivate alert type VI?')
      })
  })
  it('POST /alert-type/deactivate/confirmation with confirmation as "no" should redirect to the home page`', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertType = 'VI'
    }
    return request(app)
      .post('/alert-type/deactivate/confirmation')
      .type('form')
      .send({ confirmation: 'no' })
      .expect(302)
      .expect('Location', '/')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('POST /alert-type/deactivate/confirmation with confirmation as "yes" should redirect to the success page`', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertType = 'VI'
    }
    return request(app)
      .post('/alert-type/deactivate/confirmation')
      .type('form')
      .send({ confirmation: 'yes' })
      .expect(302)
      .expect('Location', '/alert-type/deactivate/success')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('GET /alert-type/deactivate/success should render`', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertType = 'VI'
    }
    fakeApi.delete('/alert-types/VI').reply(204)
    return request(app)
      .get('/alert-type/deactivate/success')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Alert type deactivated')
        expect(res.text).toContain('Alert type <strong>VI</strong> has been deactivated')
      })
  })
  it('GET /alert-type/deactivate/success should redirect if error`', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertType = 'VI'
    }
    return request(app)
      .get('/alert-type/deactivate/success')
      .expect(302)
      .expect('Location', '/error-page')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
})
