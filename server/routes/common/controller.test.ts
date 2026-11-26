import { Request } from 'express'
import BaseController from './controller'
import AlertsApiClient from '../../data/alertsApiClient'
import { AlertType } from '../../@types/alerts/alertsApiTypes'

class TestController extends BaseController {}

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

const alertTypeWith = (alertCodes: ReturnType<typeof alertCode>[]) =>
  ({
    code: 'XX',
    description: 'XX description',
    listSequence: 0,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    createdBy: 'USER',
    alertCodes,
  }) as unknown as AlertType

const alertTypes = [
  alertTypeWith([
    alertCode('XXU'),
    alertCode('XXA', { isRestricted: true, canBeAdministered: false }),
    alertCode('XXC', { isRestricted: true, canBeAdministered: true }),
  ]),
]

const req = { middleware: { clientToken: 'token' } } as unknown as Request

const controllerWith = (types: AlertType[]) =>
  new TestController({
    retrieveAlertTypes: jest.fn().mockResolvedValue(types),
  } as unknown as AlertsApiClient)

const codeValues = (options: { value: string | number }[]) => options.map(option => String(option.value))

describe('mapAlertTypes', () => {
  const controller = controllerWith(alertTypes)

  it('includes restricted codes when excludeRestricted is not set', async () => {
    const { alertCodes, typeCodeMap } = await controller.mapAlertTypes({ req, type: 'XX' })

    expect(codeValues(alertCodes)).toEqual(['XXA', 'XXC', 'XXU'])
    expect(codeValues(typeCodeMap.XX ?? [])).toEqual(['XXA', 'XXC', 'XXU'])
  })

  it('excludes restricted codes the user cannot administer when excludeRestricted is set', async () => {
    const { alertCodes, typeCodeMap } = await controller.mapAlertTypes({
      req,
      type: 'XX',
      excludeRestricted: true,
    })

    expect(codeValues(alertCodes)).toEqual(['XXC', 'XXU'])
    expect(codeValues(typeCodeMap.XX ?? [])).toEqual(['XXC', 'XXU'])
  })

  it('keeps unrestricted codes when excludeRestricted is set', async () => {
    const { alertCodes } = await controller.mapAlertTypes({ req, type: 'XX', excludeRestricted: true })

    expect(codeValues(alertCodes)).toContain('XXU')
  })

  it('drops an alert type with no remaining codes when excludeRestricted is set', async () => {
    const restrictedOnlyController = controllerWith([
      alertTypeWith([alertCode('XXA', { isRestricted: true, canBeAdministered: false })]),
    ])

    const { alertTypes: options } = await restrictedOnlyController.mapAlertTypes({
      req,
      excludeRestricted: true,
    })

    expect(options).toEqual([])
  })
})
