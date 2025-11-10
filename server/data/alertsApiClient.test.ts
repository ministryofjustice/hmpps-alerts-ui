import nock from 'nock'
import { randomUUID } from 'node:crypto'
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
      fakeAlertsApi.patch('/alert-codes/VI/deactivate').reply(200)
      await alertsApiClient.deactivateAlertCode('token', 'VI')
    })
    it('should deactivate an alert type', async () => {
      fakeAlertsApi.patch('/alert-types/VI/deactivate').reply(200)
      await alertsApiClient.deactivateAlertType('token', 'VI')
    })

    it('should delete an existing alert', async () => {
      const uuid = randomUUID()
      fakeAlertsApi.delete(`/alerts/${uuid}`).reply(204)
      await alertsApiClient.deleteAlert('token', uuid)
    })
  })

  describe('Existing alerts', () => {
    it('should get an existing alert', async () => {
      const uuid = randomUUID()
      fakeAlertsApi.get(`/alerts/${uuid}`).reply(200)
      await alertsApiClient.getAlert('token', uuid)
    })
    it('should delete an existing alert', async () => {
      const uuid = randomUUID()
      fakeAlertsApi.delete(`/alerts/${uuid}`).reply(204)
      await alertsApiClient.deleteAlert('token', uuid)
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

  describe('Alert code restriction', () => {
    it('should restrict an alert code', async () => {
      fakeAlertsApi.patch('/alert-codes/VI/restrict').reply(200)
      await alertsApiClient.restrictAlertCode('token', 'VI')
    })

    it('should remove restrictions from an alert code', async () => {
      fakeAlertsApi.patch('/alert-codes/VI/remove-restriction').reply(200)
      await alertsApiClient.removeRestrictionsForAlertCode('token', 'VI')
    })

    it('should add a privileged user', async () => {
      fakeAlertsApi.post('/alert-codes/VI/privileged-user/TEST_USER').reply(200)
      await alertsApiClient.addPrivilegedUser('token', 'VI', 'TEST_USER')
    })

    it('should remove a privileged user', async () => {
      fakeAlertsApi.delete('/alert-codes/VI/privileged-user/TEST_USER').reply(200)
      await alertsApiClient.removePrivilegedUser('token', 'VI', 'TEST_USER')
    })
  })
})
