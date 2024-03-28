import nock from 'nock'
import AlertsApiClient from './alertsApiClient'
import config from '../config'

describe('The alerts API client', () => {
  let fakeAlertsApi: nock.Scope
  let alertsApiClient: AlertsApiClient

  beforeEach(() => {
    fakeAlertsApi = nock(config.apis.alertsApi.url)
    alertsApiClient = new AlertsApiClient()
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('POST', () => {
    it('should create an alert type', async () => {
      fakeAlertsApi.post('/alert-types').reply(201)
      await alertsApiClient.createAlertType('token', { code: 'CO', description: 'Description' })
    })
  })
})
