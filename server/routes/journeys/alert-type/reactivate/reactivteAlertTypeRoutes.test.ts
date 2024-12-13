import { Express, Request } from 'express'
import request from 'supertest'
import nock from 'nock'
import { v4 } from 'uuid'
import { appWithAllRoutes } from '../../../testutils/appSetup'
import config from '../../../../config'
import { AlertType } from '../../../../@types/alerts/alertsApiTypes'
import SessionSetup from '../../../testutils/sessionSetup'

let app: Express
let sessionSetup: SessionSetup
let fakeApi: nock.Scope
let uuid = v4()

beforeEach(() => {
  sessionSetup = new SessionSetup()
  config.apis.alertsApi.url = 'http://localhost:8100'
  fakeApi = nock(config.apis.alertsApi.url)
  app = appWithAllRoutes({
    sessionSetup,
  })
  uuid = v4()
})

afterEach(() => {
  jest.resetAllMocks()
})
const alertTypes = [
  {
    code: 'VI',
    description: 'Victim',
    isActive: false,
    alertCodes: [{ code: 'AA', description: 'Alert code' }],
  } as AlertType,
  {
    code: 'AA',
    description: 'A type',
    isActive: false,
  } as AlertType,
]

describe('reactivateAlertCode', () => {
  it('GET /alert-type/reactivate should render', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
    }
    fakeApi.get('/alert-types?includeInactive=true').reply(200, alertTypes)
    return request(app)
      .get(`/${uuid}/alert-type/reactivate`)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Reactivate an alert type')
        expect(res.text).toContain('Select an alert type')
        expect(res.text).toContain('Victim')
      })
  })
  it('POST /alert-type/reactivate should redirect', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: {},
        instanceUnixEpoch: Date.now(),
      }
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .post(`/${uuid}/alert-type/reactivate`)
      .type('form')
      .send({ alertType: 'DB' })
      .expect(302)
      .expect('Location', 'reactivate/confirmation')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('GET /alert-type/reactivate/confirmation should render', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: { reactivateAlertType: 'VI' },
        instanceUnixEpoch: Date.now(),
      }
    }
    return request(app)
      .get(`/${uuid}/alert-type/reactivate/confirmation`)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Reactivate an alert type')
        expect(res.text).toContain('Are you sure you want to reactivate alert type VI?')
      })
  })
  it('POST /alert-type/reactivate/confirmation with nothing selected should render error', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: { reactivateAlertType: 'VI' },
        instanceUnixEpoch: Date.now(),
      }
    }
    return request(app)
      .post(`/${uuid}/alert-type/reactivate/confirmation`)
      .type('form')
      .send({})
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Reactivate an alert type')
        expect(res.text).toContain('You must select either Yes or No.')
        expect(res.text).toContain('Are you sure you want to reactivate alert type VI?')
      })
  })
  it('POST /alert-type/reactivate/confirmation with confirmation as an empty string should render error', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: { reactivateAlertType: 'VI' },
        instanceUnixEpoch: Date.now(),
      }
    }
    return request(app)
      .post(`/${uuid}/alert-type/reactivate/confirmation`)
      .type('form')
      .send({ confirmation: '' })
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Reactivate an alert type')
        expect(res.text).toContain('You must select either Yes or No.')
        expect(res.text).toContain('Are you sure you want to reactivate alert type VI?')
      })
  })
  it('POST /alert-type/reactivate/confirmation with confirmation as "no" should redirect to the home page`', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: { reactivateAlertType: 'VI' },
        instanceUnixEpoch: Date.now(),
      }
    }
    return request(app)
      .post(`/${uuid}/alert-type/reactivate/confirmation`)
      .type('form')
      .send({ confirmation: 'no' })
      .expect(302)
      .expect('Location', '/')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('POST /alert-type/reactivate/confirmation with confirmation as "yes" should redirect to the success page`', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: { reactivateAlertType: 'VI' },
        instanceUnixEpoch: Date.now(),
      }
    }
    return request(app)
      .post(`/${uuid}/alert-type/reactivate/confirmation`)
      .type('form')
      .send({ confirmation: 'yes' })
      .expect(302)
      .expect('Location', 'success')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('GET /alert-type/reactivate/success should render`', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: { reactivateAlertType: 'VI' },
        instanceUnixEpoch: Date.now(),
      }
    }
    fakeApi.patch('/alert-types/VI/reactivate').reply(204)
    return request(app)
      .get(`/${uuid}/alert-type/reactivate/success`)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Alert type reactivated')
        expect(res.text).toContain('Alert type <strong>VI</strong> has been reactivated')
      })
  })
  it('GET /alert-type/reactivate/success should redirect if error`', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: { reactivateAlertType: 'VI' },
        instanceUnixEpoch: Date.now(),
      }
    }
    return request(app)
      .get(`/${uuid}/alert-type/reactivate/success`)
      .expect(302)
      .expect('Location', '/error-page')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
})
