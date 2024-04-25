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
    it('should create an alert code', async () => {
      fakeAlertsApi.post('/alert-codes').reply(201)
      await alertsApiClient.createAlertCode('token', { code: 'CO', description: 'Description', parent: 'AA' })
    })
  })

  describe('DELETE', () => {
    it('should deactivate an alert code', async () => {
      fakeAlertsApi.delete('/alert-codes/VI').reply(204)
      await alertsApiClient.deactivateAlertCode('token', 'VI')
    })
    it('should deactivate an alert code', async () => {
      fakeAlertsApi.delete('/alert-types/VI').reply(204)
      await alertsApiClient.deactivateAlertType('token', 'VI')
    })
  })
})
