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
  it('GET /alert-type/create should render', () => {
    return request(app)
      .get('/alert-type/create')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Create an alert type')
      })
  })
  it('POST /alert-type/create should submit if all fields entered', () => {
    return request(app)
      .post('/alert-type/create')
      .type('form')
      .send({ alertTypeCode: 'DB', alertTypeDescription: 'Description' })
      .expect(302)
      .expect('Location', '/alert-type/confirmation')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
  it('POST /alert-type/create should render both errors if no fields entered', () => {
    return request(app)
      .post('/alert-type/create')
      .type('form')
      .send({})
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain(
          'An alert type code must be an uppercase series of letters between 1-12 characters long',
        )
        expect(res.text).toContain('An alert type description must be between 1 and 40 characters')
      })
  })
  it('POST /alert-type/create should render code error if no code entered', () => {
    return request(app)
      .post('/alert-type/create')
      .type('form')
      .send({ alertTypeCode: '', alertTypeDescription: 'This is a unique description' })
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain(
          'An alert type code must be an uppercase series of letters between 1-12 characters long',
        )
        expect(res.text).toContain('This is a unique description')
        expect(res.text).not.toContain('An alert type description must be between 1 and 40 characters')
      })
  })
  it('POST /alert-type/create should render code error if invalid code entered', () => {
    return request(app)
      .post('/alert-type/create')
      .type('form')
      .send({ alertTypeCode: 'abcd', alertTypeDescription: 'This is a unique description' })
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain(
          'An alert type code must be an uppercase series of letters between 1-12 characters long',
        )
        expect(res.text).toContain('This is a unique description')
        expect(res.text).not.toContain('An alert type description must be between 1 and 40 characters')
      })
  })
  it('POST /alert-type/create should render code error if too long code entered', () => {
    return request(app)
      .post('/alert-type/create')
      .type('form')
      .send({ alertTypeCode: 'ABCDABCDABCDE', alertTypeDescription: 'This is a unique description' })
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).toContain(
          'An alert type code must be an uppercase series of letters between 1-12 characters long',
        )
        expect(res.text).toContain('This is a unique description')
        expect(res.text).not.toContain('An alert type description must be between 1 and 40 characters')
      })
  })
  it('POST /alert-type/create should render description error if no description entered', () => {
    return request(app)
      .post('/alert-type/create')
      .type('form')
      .send({ alertTypeCode: 'AA', alertTypeDescription: '' })
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).not.toContain(
          'An alert type code must be an uppercase series of letters between 1-12 characters long',
        )
        expect(res.text).toContain('An alert type description must be between 1 and 40 characters')
        expect(res.text).toContain('AA')
      })
  })
  it('POST /alert-type/create should render description error if too long a description entered', () => {
    return request(app)
      .post('/alert-type/create')
      .type('form')
      .send({ alertTypeCode: 'AA', alertTypeDescription: 'n'.repeat(41) })
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('There is a problem')
        expect(res.text).not.toContain(
          'An alert type code must be an uppercase series of letters between 1-12 characters long',
        )
        expect(res.text).toContain('An alert type description must be between 1 and 40 characters')
        expect(res.text).toContain('AA')
      })
  })
  it('GET /alert-type/confirmation should render confirmation page', () => {
    return request(app)
      .get('/alert-type/confirmation')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Check your answers before creating your alert type')
      })
  })
  // Update this test when check that the alert type has been saved (next ticket)
  it('POST /alert-type/confirmation should redirect to success page', () => {
    return request(app)
      .post('/alert-type/confirmation')
      .expect(302)
      .expect('Location', '/alert-type/success')
      .expect(res => {
        expect(res.redirect).toBeTruthy()
      })
  })
})
