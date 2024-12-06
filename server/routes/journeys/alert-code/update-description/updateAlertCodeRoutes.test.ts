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
    services: {},
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
    isActive: true,
    alertCodes: [{ code: 'AA', description: 'Alert code', isActive: true }],
  } as AlertType,
  {
    code: 'AA',
    description: 'A type',
    isActive: true,
  } as AlertType,
]

describe('updateAlertCode', () => {
  it('GET /alert-code/update-description should render', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .get(`/${uuid}/alert-code/update-description`)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Update alert code description')
        expect(res.text).toContain(
          'Selecting an alert type will allow you to choose the code for which you are going to update the description.',
        )
        expect(res.text).toContain('Select an alert type')
        expect(res.text).toContain('Victim')
      })
  })
  it('POST /alert-code/update-description should redirect', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: {},
        instanceUnixEpoch: Date.now(),
      }
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .post(`/${uuid}/alert-code/update-description`)
      .type('form')
      .send({ alertType: 'DB' })
      .expect(302)
      .expect('Location', 'update-description/alert-code')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('GET /alert-code/update-description/alert-code should render', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: {
          alertCodeParentType: 'VI',
        },
        instanceUnixEpoch: Date.now(),
      }
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .get(`/${uuid}/alert-code/update-description/alert-code`)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Update alert code description')
        expect(res.text).toContain('Select an alert code')
        expect(res.text).toContain('AA')
      })
  })
  it('POST /alert-code/update-description/alert-code should redirect', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: {
          alertCodeParentType: 'VI',
        },
        instanceUnixEpoch: Date.now(),
      }
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .post(`/${uuid}/alert-code/update-description/alert-code`)
      .type('form')
      .send({ alertCode: 'AA' })
      .expect(302)
      .expect('Location', 'submit-description')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('GET /alert-code/update-description/submit-description should render', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: {
          alertCodeParentType: 'VI',
          alertCode: 'AA',
        },
        instanceUnixEpoch: Date.now(),
      }
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .get(`/${uuid}/alert-code/update-description/submit-description`)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Update alert code description')
        expect(res.text).toContain('Enter a new description for alert code')
        expect(res.text).toContain('Alert code')
      })
  })
  it('POST /alert-code/update-description/submit-description should redirect', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: {
          alertCodeParentType: 'VI',
          alertCode: 'AA',
        },
        instanceUnixEpoch: Date.now(),
      }
    }
    return request(app)
      .post(`/${uuid}/alert-code/update-description/submit-description`)
      .type('form')
      .send({ descriptionEntry: 'New Description' })
      .expect(302)
      .expect('Location', 'confirmation')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('POST /alert-code/update-description/submit-description should render error if no description entered', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: {
          alertCodeParentType: 'VI',
          alertCode: 'AA',
        },
        instanceUnixEpoch: Date.now(),
      }
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .post(`/${uuid}/alert-code/update-description/submit-description`)
      .type('form')
      .send({})
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('An alert code description must be between 1 and 40 characters')
      })
  })
  it('POST /alert-code/update-description/submit-description should render error if too long a description entered', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: {
          alertCodeParentType: 'VI',
          alertCode: 'AA',
        },
        instanceUnixEpoch: Date.now(),
      }
    }
    fakeApi.get('/alert-types').reply(200, alertTypes)
    return request(app)
      .post(`/${uuid}/alert-code/update-description/submit-description`)
      .type('form')
      .send({ descriptionEntry: 'n'.repeat(41) })
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('An alert code description must be between 1 and 40 characters')
      })
  })
  it('GET /alert-code/update-description/confirmation should render', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: {
          alertCodeParentType: 'VI',
          alertCode: 'AA',
          alertDescription: 'New Description',
        },
        instanceUnixEpoch: Date.now(),
      }
    }
    return request(app)
      .get(`/${uuid}/alert-code/update-description/confirmation`)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain(
          'Are you sure you want to change the description for alert code &quot;AA&quot; to &quot;New Description&quot;?',
        )
      })
  })
  it('POST /alert-code/update-description/confirmation should redirect if "yes" selected', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: {
          alertCodeParentType: 'VI',
          alertCode: 'AA',
          alertDescription: 'New Description',
        },
        instanceUnixEpoch: Date.now(),
      }
    }
    return request(app)
      .post(`/${uuid}/alert-code/update-description/confirmation`)
      .type('form')
      .send({ confirmation: 'yes' })
      .expect(302)
      .expect('Location', 'success')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('POST /alert-code/update-description/confirmation should redirect if "no" selected', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: {
          alertCodeParentType: 'VI',
          alertCode: 'AA',
          alertDescription: 'New Description',
        },
        instanceUnixEpoch: Date.now(),
      }
    }
    return request(app)
      .post(`/${uuid}/alert-code/update-description/confirmation`)
      .type('form')
      .send({ confirmation: 'no' })
      .expect(302)
      .expect('Location', '/')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('POST /alert-code/update-description/confirmation should render error if no confirmation selected', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: {
          alertCodeParentType: 'VI',
          alertCode: 'AA',
          alertDescription: 'New Description',
        },
        instanceUnixEpoch: Date.now(),
      }
    }
    return request(app)
      .post(`/${uuid}/alert-code/update-description/confirmation`)
      .type('form')
      .send({})
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('You must select either Yes or No.')
      })
  })
  it('GET /alert-code/update-description/success should render', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: {
          alertCodeParentType: 'VI',
          alertCode: 'AA',
          alertDescription: 'New Description',
        },
        instanceUnixEpoch: Date.now(),
      }
    }
    fakeApi.patch('/alert-codes/AA').reply(200, { code: 'AA', description: 'New Description' } as AlertType)
    return request(app)
      .get(`/${uuid}/alert-code/update-description/success`)
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain(
          'Alert code: <strong>AA</strong> is updated with new description: <strong>New Description</strong>.',
        )
      })
  })
  it('GET /alert-code/update-description/success should redirect to error page if API fails', () => {
    sessionSetup.sessionDoctor = (req: Request) => {
      req.middleware = { clientToken: '123' }
      req.journeyData = {
        refData: {
          alertCodeParentType: 'VI',
          alertCode: 'AA',
          alertDescription: 'New Description',
        },
        instanceUnixEpoch: Date.now(),
      }
    }
    fakeApi.patch('/alert-codes/VI').reply(404)
    return request(app)
      .get(`/${uuid}/alert-code/update-description/success`)
      .expect(302)
      .expect('Location', '/error-page')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
})
