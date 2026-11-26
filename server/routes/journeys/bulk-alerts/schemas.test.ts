import { Request } from 'express'
import { schemaFactory } from './schemas'
import AlertsApiClient from '../../../data/alertsApiClient'
import { AlertType } from '../../../@types/alerts/alertsApiTypes'

const alertCode = (code: string, overrides: Record<string, unknown> = {}) => ({
  alertTypeCode: 'XX',
  code,
  description: `${code} description`,
  listSequence: 0,
  isActive: true,
  isRestricted: false,
  canBeAdministered: true,
  createdAt: '2025-01-01T00:00:00Z',
  createdBy: 'USER',
  ...overrides,
})

const alertTypes = [
  {
    code: 'XX',
    description: 'XX description',
    listSequence: 0,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    createdBy: 'USER',
    alertCodes: [
      alertCode('XXU'),
      alertCode('XXA', { isRestricted: true, canBeAdministered: false }),
      alertCode('XXC', { isRestricted: true, canBeAdministered: true }),
    ],
  },
] as unknown as AlertType[]

const req = { middleware: { clientToken: 'token' } } as unknown as Request

const schemaWith = async (types: AlertType[]) =>
  schemaFactory({
    retrieveAlertTypes: jest.fn().mockResolvedValue(types),
  } as unknown as AlertsApiClient)(req)

describe('bulk alerts submit schema', () => {
  it.each(['XXU', 'XXC'])('accepts unrestricted or administrable code %s', async code => {
    const schema = await schemaWith(alertTypes)

    const result = await schema.safeParseAsync({ alertType: 'XX', alertCode: code })

    expect(result.success).toBe(true)
  })

  it('rejects a restricted code the user cannot administer', async () => {
    const schema = await schemaWith(alertTypes)

    const result = await schema.safeParseAsync({ alertType: 'XX', alertCode: 'XXA' })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map(issue => issue.message)).toContain('You must select an alert')
  })

  it('rejects an unknown code', async () => {
    const schema = await schemaWith(alertTypes)

    const result = await schema.safeParseAsync({ alertType: 'XX', alertCode: 'NOPE' })

    expect(result.success).toBe(false)
  })
})
