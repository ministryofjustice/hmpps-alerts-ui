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
      .get('/alertType/create')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Create an alert type')
      })
  })
  it('POST /alertType/create should submit if all fields entered', () => {
    return request(app)
      .post('/alertType/create')
      .type('form')
      .send({ alertTypeCode: 'DB', alertTypeDescription: 'Description' })
      .expect(302)
      .expect('Location', '/alertType/confirmation')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('POST /alertType/create should render both errors if no fields entered', () => {
    return request(app)
      .post('/alertType/create')
      .type('form')
      .send({})
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('An alert type code must be between 1 and 12 characters')
        expect(res.text).toContain('An alert type description must be between 1 and 40 characters')
      })
  })
  it('POST /alertType/create should render code error if no code entered', () => {
    return request(app)
      .post('/alertType/create')
      .type('form')
      .send({ alertTypeCode: '', alertTypeDescription: 'This is a unique description' })
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain('An alert type code must be between 1 and 12 characters')
        expect(res.text).toContain('This is a unique description')
        expect(res.text).not.toContain('An alert type description must be between 1 and 40 characters')
      })
  })
  it('POST /alertType/create should render description error if no description entered', () => {
    return request(app)
      .post('/alertType/create')
      .type('form')
      .send({ alertTypeCode: 'AA', alertTypeDescription: '' })
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).not.toContain('An alert type code must be between 1 and 12 characters')
        expect(res.text).toContain('An alert type description must be between 1 and 40 characters')
        expect(res.text).toContain('AA')
      })
  })
  it('GET /alertType/confirmation should render confirmation page', () => {
    return request(app)
      .get('/alertType/confirmation')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Check your answers before creating your alert type')
      })
  })
  // Update this test when check that the alert type has been saved (next ticket)
  it('POST /alertType/confirmation should redirect to success page', () => {
    return request(app)
      .post('/alertType/confirmation')
      .expect(302)
      .expect('Location', '/alertType/success')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
})
