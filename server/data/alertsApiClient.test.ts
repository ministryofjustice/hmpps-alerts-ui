import nock from 'nock'
import { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import AlertsApiClient from './alertsApiClient'
import config from '../config'

describe('The alerts API client', () => {
  let fakeAlertsApi: nock.Scope
  let alertsApiClient: AlertsApiClient
  let mockAuthenticationClient: jest.Mocked<AuthenticationClient>

  beforeEach(() => {
    mockAuthenticationClient = {
      getToken: jest.fn().mockResolvedValue('test-system-token'),
    } as unknown as jest.Mocked<AuthenticationClient>
    fakeAlertsApi = nock(config.apis.alertsApi.url)
    alertsApiClient = new AlertsApiClient(mockAuthenticationClient)
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
      fakeAlertsApi.patch('/alert-codes/VI/deactivate').reply(200)
      await alertsApiClient.deactivateAlertCode('token', 'VI')
    })
    it('should deactivate an alert code', async () => {
      fakeAlertsApi.patch('/alert-types/VI/deactivate').reply(200)
      await alertsApiClient.deactivateAlertType('token', 'VI')
    })
  })

  describe('Encode codes in URLs', () => {
    it('should activate alert type', async () => {
      const type = "&'+-.<=>"
      fakeAlertsApi.patch(`/alert-types/${encodeURIComponent(type)}/reactivate`).reply(201)
      await alertsApiClient.reactivateAlertType('token', type)
    })
    it('should activate an alert code', async () => {
      const code = "&'+-.<=>"
      fakeAlertsApi.patch(`/alert-codes/${encodeURIComponent(code)}/reactivate`).reply(201)
      await alertsApiClient.reactivateAlertCode('token', code)
    })
    it('should deactivate alert type', async () => {
      const type = "&'+-.<=>"
      fakeAlertsApi.patch(`/alert-types/${encodeURIComponent(type)}/deactivate`).reply(200)
      await alertsApiClient.deactivateAlertType('token', type)
    })
    it('should deactivate an alert code', async () => {
      const code = "&'+-.<=>"
      fakeAlertsApi.patch(`/alert-codes/${encodeURIComponent(code)}/deactivate`).reply(200)
      await alertsApiClient.deactivateAlertCode('token', code)
    })
    it('should update type description', async () => {
      const type = "&'+-.<=>"
      fakeAlertsApi.patch(`/alert-types/${encodeURIComponent(type)}`).reply(200)
      await alertsApiClient.updateAlertType('token', type, { description: 'Description was updated' })
    })
    it('should update code description', async () => {
      const code = "&'+-.<=>"
      fakeAlertsApi.patch(`/alert-codes/${encodeURIComponent(code)}`).reply(200)
      await alertsApiClient.updateAlertCode('token', code, { description: 'Description was updated' })
    })
  })
})
