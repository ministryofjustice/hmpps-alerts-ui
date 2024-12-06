import { Express, Request } from 'express'
import request from 'supertest'
import nock from 'nock'
import { v4 as uuidV4 } from 'uuid'
import { appWithAllRoutes } from '../../../testutils/appSetup'
import config from '../../../../config'
import { AlertType } from '../../../../@types/alerts/alertsApiTypes'
import SessionSetup from '../../../testutils/sessionSetup'

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
const alertTypes = [{ code: 'VI', description: 'Victim', isActive: true } as AlertType]
describe('createAlertCodeRoutes', () => {
  it('GET /alert-code/create should render', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .get(`/${uuidV4()}/alert-code/create`)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Create an alert code')
        expect(res.text).toContain('Select an alert type')
        expect(res.text).toContain('Victim')
      })
  })
  it('POST /alert-code/create should redirect', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = { refData: {}, instanceUnixEpoch: Date.now() }
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .post(`/${uuidV4()}/alert-code/create`)
      .type('form')
      .send({ alertType: 'DB' })
      .expect(302)
      .expect('Location', 'alert-code')
  })
  it('POST /alert-code/create should render with error', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .post(`/${uuidV4()}/alert-code/create`)
      .type('form')
      .send({ alertType: '' })
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Create an alert code')
        expect(res.text).toContain('Select an alert type')
        expect(res.text).toContain('Victim')
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('An alert type must be selected')
      })
  })
  it('GET /alert-code/alert-code should render', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = { refData: {}, instanceUnixEpoch: Date.now() }
    }
    return request(app)
      .get(`/${uuidV4()}/alert-code/alert-code`)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Add alert code details')
      })
  })
  it('POST /alert-code/alert-code should redirect', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = { refData: {}, instanceUnixEpoch: Date.now() }
    }
    return request(app)
      .post(`/${uuidV4()}/alert-code/alert-code`)
      .type('form')
      .send({ alertCode: 'DB', alertDescription: 'A description' })
      .expect(302)
      .expect('Location', 'confirmation')
  })
  it('POST /alert-code/alert-code should render both errors if no fields entered', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = { refData: {}, instanceUnixEpoch: Date.now() }
    }
    return request(app)
      .post(`/${uuidV4()}/alert-code/alert-code`)
      .type('form')
      .send({})
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('An alert code must be an uppercase series of letters between 1-12 characters long')
        expect(res.text).toContain('An alert code description must be between 1 and 40 characters')
      })
  })
  it('POST /alert-code/alert-code should render code error if no code entered', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = { refData: {}, instanceUnixEpoch: Date.now() }
    }
    return request(app)
      .post(`/${uuidV4()}/alert-code/alert-code`)
      .type('form')
      .send({ alertCode: '', alertDescription: 'A description' })
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('An alert code must be an uppercase series of letters between 1-12 characters long')
        expect(res.text).toContain('A description')
        expect(res.text).not.toContain('An alert code description must be between 1 and 40 characters')
      })
  })
  it('POST /alert-code/alert-code should render code error if invalid code entered', () => {
    return request(app)
      .post(`/${uuidV4()}/alert-code/alert-code`)
      .type('form')
      .send({ alertCode: 'abcd', alertDescription: 'A description' })
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('An alert code must be an uppercase series of letters between 1-12 characters long')
        expect(res.text).toContain('A description')
        expect(res.text).not.toContain('An alert code description must be between 1 and 40 characters')
      })
  })
  it('POST /alert-code/alert-code should render code error if too long a code entered', () => {
    return request(app)
      .post(`/${uuidV4()}/alert-code/alert-code`)
      .type('form')
      .send({ alertCode: 'ABCDABCDABCDE', alertDescription: 'A description' })
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('An alert code must be an uppercase series of letters between 1-12 characters long')
        expect(res.text).toContain('A description')
        expect(res.text).not.toContain('An alert code description must be between 1 and 40 characters')
      })
  })
  it('POST /alert-code/alert-code should render description error if no description entered', () => {
    return request(app)
      .post(`/${uuidV4()}/alert-code/alert-code`)
      .type('form')
      .send({ alertCode: 'DB', alertDescription: '' })
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).not.toContain(
          'An alert code must be an uppercase series of letters between 1-12 characters long',
        )
        expect(res.text).toContain('An alert code description must be between 1 and 40 characters')
        expect(res.text).toContain('DB')
      })
  })
  it('POST /alert-code/alert-code should render description error if too long a description entered', () => {
    return request(app)
      .post(`/${uuidV4()}/alert-code/alert-code`)
      .type('form')
      .send({ alertCode: 'DB', alertDescription: 'n'.repeat(41) })
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).not.toContain(
          'An alert code must be an uppercase series of letters between 1-12 characters long',
        )
        expect(res.text).toContain('An alert code description must be between 1 and 40 characters')
        expect(res.text).toContain('DB')
      })
  })
  it('GET /alert-code/confirmation should render', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.journeyData = {
        refData: {
          alertCode: 'AA',
          alertDescription: 'A description',
          alertCodeParentType: 'BB',
        },
        instanceUnixEpoch: Date.now(),
      }
    }
    return request(app)
      .get(`/${uuidV4()}/alert-code/confirmation`)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Check your answers before creating your alert code')
        expect(res.text).toContain('AA')
        expect(res.text).toContain('A description')
        expect(res.text).toContain('BB')
      })
  })
  it('POST /alert-code/confirmation should redirect', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.journeyData = {
        refData: {
          alertCode: 'AA',
          alertDescription: 'A description',
          alertCodeParentType: 'BB',
        },
        instanceUnixEpoch: Date.now(),
      }
    }
    return request(app)
      .post(`/${uuidV4()}/alert-code/confirmation`)
      .type('form')
      .send({ parent: 'DB', code: 'AA', description: 'A description' })
      .expect(302)
      .expect('Location', 'success')
  })
  it('GET /alert-code/success should render', () => {
    fakeApi.post('/alert-codes').reply(201)
    sessionSetup.sessionDoctor = (req: Request) => {
      req.journeyData = {
        refData: {
          alertCode: 'AA',
          alertDescription: 'A description',
          alertCodeParentType: 'BB',
        },
        instanceUnixEpoch: Date.now(),
      }
      req.middleware = { clientToken: '123' }
    }
    return request(app)
      .get(`/${uuidV4()}/alert-code/success`)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Alert code created')
      })
  })
  it('GET /alert-code/success should redirect to error page', () => {
    fakeApi.post('/alert-codes').reply(405)
    sessionSetup.sessionDoctor = (req: Request) => {
      req.journeyData = {
        refData: {
          alertCode: 'AA',
          alertDescription: 'A description',
          alertCodeParentType: 'BB',
        },
        instanceUnixEpoch: Date.now(),
      }
      req.middleware = { clientToken: '123' }
    }
    return request(app).get(`/${uuidV4()}/alert-code/success`).expect(302).expect('Location', '/error-page')
  })
  it('GET /alert-code/success 409 should render code entry page', () => {
    fakeApi.post('/alert-codes').reply(409)
    sessionSetup.sessionDoctor = (req: Request) => {
      req.journeyData = {
        refData: {
          alertCode: 'AA',
          alertDescription: 'A description',
          alertCodeParentType: 'BB',
        },
        instanceUnixEpoch: Date.now(),
      }
      req.middleware = { clientToken: '123' }
    }
    return request(app)
      .get(`/${uuidV4()}/alert-code/success`)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('Alert code &#39;AA&#39; already exists')
      })
  })
})
