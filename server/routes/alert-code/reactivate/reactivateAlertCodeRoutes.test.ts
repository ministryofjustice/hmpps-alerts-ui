import { Express, Request } from 'express'
import request from 'supertest'
import nock from 'nock'
import { appWithAllRoutes } from '../../testutils/appSetup'
import config from '../../../config'
import { AlertType } from '../../../@types/alerts/alertsApiTypes'
import SessionSetup from '../../testutils/sessionSetup'

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
    isActive: false,
    alertCodes: [{ code: 'AA', description: 'Alert code', isActive: false }],
  } as AlertType,
  {
    code: 'AA',
    description: 'A type',
    isActive: true,
  } as AlertType,
]

describe('reactivateAlertCode', () => {
  it('GET /alert-code/reactivate should render', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
    }
    fakeApi.get('/alert-types?includeInactive=true').reply(200, alertTypes)
    return request(app)
      .get('/alert-code/reactivate')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Reactivate an alert code')
        expect(res.text).toContain(
          'Selecting an alert type will allow you to choose the code you are going to reactivate.',
        )
        expect(res.text).toContain('Select an alert type')
        expect(res.text).toContain('Victim')
      })
  })
  it('POST /alert-code/reactivate should redirect', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
    }
    fakeApi.get('/alert-types?includeInactive=true').reply(200, alertTypes)
    return request(app)
      .post('/alert-code/reactivate')
      .type('form')
      .send({ alertType: 'DB' })
      .expect(302)
      .expect('Location', '/alert-code/reactivate/alert-code')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('GET /alert-code/reactivate/alert-code should render', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertTypeCode = 'VI'
    }
    fakeApi.get('/alert-types?includeInactive=true').reply(200, alertTypes)
    return request(app)
      .get('/alert-code/reactivate/alert-code')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Reactivate an alert code')
        expect(res.text).toContain('Select an alert code')
        expect(res.text).toContain('Alert code')
      })
  })
  it('GET /alert-code/reactivate/alert-code no codes should redirect', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertTypeCode = 'AA'
    }
    fakeApi.get('/alert-types?includeInactive=true').reply(200, alertTypes)
    return request(app)
      .get('/alert-code/reactivate/alert-code')
      .expect(302)
      .expect('Location', '/error-page')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('POST /alert-code/reactivate/alert-code should redirect', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
    }
    fakeApi.get('/alert-types?includeInactive=true').reply(200, alertTypes)
    return request(app)
      .post('/alert-code/reactivate/alert-code')
      .type('form')
      .send({ alertCode: 'DB' })
      .expect(302)
      .expect('Location', '/alert-code/reactivate/confirmation')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('POST /alert-code/reactivate/alert-code no alert code shows error', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertTypeCode = 'VI'
    }
    fakeApi.get('/alert-types?includeInactive=true').reply(200, alertTypes)
    return request(app)
      .post('/alert-code/reactivate/alert-code')
      .type('form')
      .send({})
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Reactivate an alert code')
        expect(res.text).toContain('An alert code must be selected')
      })
  })
  it('GET /alert-code/reactivate/confirmation should render', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertTypeCode = 'VI'
      req.session.reactivateAlertCode = 'AA'
    }
    return request(app)
      .get('/alert-code/reactivate/confirmation')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Reactivate an alert code')
        expect(res.text).toContain('Are you sure you want to reactivate alert code AA?')
      })
  })
  it('POST /alert-code/reactivate/confirmation with nothing selected should render error', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertTypeCode = 'VI'
      req.session.reactivateAlertCode = 'AA'
    }
    return request(app)
      .post('/alert-code/reactivate/confirmation')
      .type('form')
      .send({})
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Reactivate an alert code')
        expect(res.text).toContain('You must select either Yes or No.')
        expect(res.text).toContain('Are you sure you want to reactivate alert code AA?')
      })
  })
  it('POST /alert-code/reactivate/confirmation with confirmation as an empty string should render error', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertTypeCode = 'VI'
      req.session.reactivateAlertCode = 'AA'
    }
    return request(app)
      .post('/alert-code/reactivate/confirmation')
      .type('form')
      .send({ confirmation: '' })
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Reactivate an alert code')
        expect(res.text).toContain('You must select either Yes or No.')
        expect(res.text).toContain('Are you sure you want to reactivate alert code AA?')
      })
  })
  it('POST /alert-code/reactivate/confirmation with confirmation as "no" should redirect to the home page`', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertTypeCode = 'VI'
      req.session.reactivateAlertCode = 'AA'
    }
    return request(app)
      .post('/alert-code/reactivate/confirmation')
      .type('form')
      .send({ confirmation: 'no' })
      .expect(302)
      .expect('Location', '/')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('POST /alert-code/reactivate/confirmation with confirmation as "yes" should redirect to the success page`', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertTypeCode = 'VI'
      req.session.reactivateAlertCode = 'AA'
    }
    return request(app)
      .post('/alert-code/reactivate/confirmation')
      .type('form')
      .send({ confirmation: 'yes' })
      .expect(302)
      .expect('Location', '/alert-code/reactivate/success')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('GET /alert-code/reactivate/success should render`', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertTypeCode = 'VI'
      req.session.reactivateAlertCode = 'AA'
    }
    fakeApi.patch('/alert-codes/AA/reactivate').reply(200)
    return request(app)
      .get('/alert-code/reactivate/success')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Alert code reactivated')
        expect(res.text).toContain('Alert code <strong>AA</strong> has been reactivated')
      })
  })
  it('GET /alert-code/reactivate/success should redirect if error`', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = {}
      req.middleware.clientToken = '123'
      req.session.deactivateAlertTypeCode = 'VI'
      req.session.reactivateAlertCode = 'AA'
    }
    return request(app)
      .get('/alert-code/reactivate/success')
      .expect(302)
      .expect('Location', '/error-page')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
})
