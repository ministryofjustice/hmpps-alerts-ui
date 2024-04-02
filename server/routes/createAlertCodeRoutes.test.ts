import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'

let app: Express
beforeEach(() => {
  app = appWithAllRoutes({
    services: {},
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('createAlertTypeRoutes', () => {
  it('GET /alertType/create should render', () => {
    return request(app)
      .get('/alertCode/create')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Create an alert code')
      })
  })
})
