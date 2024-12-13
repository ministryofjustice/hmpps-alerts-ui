import AuditService from './auditService'
import HmppsAuditClient from '../data/hmppsAuditClient'

jest.mock('../data/hmppsAuditClient')

describe('Audit service', () => {
  let hmppsAuditClient: jest.Mocked<HmppsAuditClient>
  let auditService: AuditService

  beforeEach(() => {
    hmppsAuditClient = new HmppsAuditClient({
      enabled: false,
      queueUrl: '',
      region: '',
      serviceName: '',
    }) as jest.Mocked<HmppsAuditClient>
    auditService = new AuditService(hmppsAuditClient)
  })

  describe('logPageView', () => {
    it('sends page view event audit message using audit client', async () => {
      await auditService.logPageView(
        {},
        { extraDetails: 'example' },
        {
          pageNameSuffix: 'EXAMPLE_PAGE',
          who: 'user1',
          correlationId: 'request123',
          details: {},
        },
      )

      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith({
        what: 'PAGE_VIEW_EXAMPLE_PAGE',
        who: 'user1',
        correlationId: 'request123',
        details: {},
      })
    })
  })
})
