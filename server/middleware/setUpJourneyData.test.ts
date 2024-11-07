import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import setUpJourneyData from './setUpJourneyData'
import { JourneyData } from '../@types/express'

const middleware = setUpJourneyData()

let req: Request
let res: Response

let journeyId: string

const next = jest.fn()

beforeEach(() => {
  journeyId = uuidV4()

  res = {
    redirect: jest.fn(),
  } as unknown as Response

  req = {
    session: {},
    params: { journeyId },
  } as unknown as Request
})

describe('setUpJourneyData', () => {
  describe('create journey data map', () => {
    it('should create a new journey data map when map is undefined', async () => {
      // @ts-expect-error setting non-nullable property to undefined
      req.session.journeyDataMap = undefined

      middleware(req, res, next)
      expect(req.journeyData).not.toBeNull()

      expect(req.session.journeyDataMap).not.toBeUndefined()
      expect(req.session.journeyDataMap).not.toBeNull()
    })

    it('should create a new journey data map when map is null', async () => {
      // @ts-expect-error setting non-nullable property to null
      req.session.journeyDataMap = null

      middleware(req, res, next)
      expect(req.journeyData).not.toBeNull()

      expect(req.session.journeyDataMap).not.toBeUndefined()
      expect(req.session.journeyDataMap).not.toBeNull()
    })

    it('should not create a new journey data map when there is a map', async () => {
      const existingMap = {
        id: { instanceUnixEpoch: Date.now() },
      }
      req.session.journeyDataMap = existingMap

      middleware(req, res, next)

      expect(req.session.journeyDataMap).toBe(existingMap)
    })
  })

  describe('get journey data', () => {
    it('should create a new journey data when map does not contain data for the journey id', async () => {
      middleware(req, res, next)

      expect(req.journeyData).not.toBeUndefined()
      expect(req.journeyData).not.toBeNull()
    })

    it('should return existing journey data when journey data is found for the journey id', async () => {
      req.session.journeyDataMap = {}
      const existingData: JourneyData = {
        instanceUnixEpoch: Date.now(),
        isCheckAnswers: true,
      }
      req.session.journeyDataMap[journeyId] = existingData

      middleware(req, res, next)

      expect(req.journeyData).toBe(existingData)
    })

    it('should clean up oldest journey data when max number is exceeded', async () => {
      const epoch = Date.now() - 100000 // Reduced by 100 seconds to avoid clash of epoch

      req.session.journeyDataMap = {}

      Array.from(Array(100).keys()).forEach(idx => {
        req.session.journeyDataMap ??= {}
        req.session.journeyDataMap[uuidV4()] = { instanceUnixEpoch: epoch + idx }
      })

      middleware(req, res, next)

      expect(Object.keys(req.session.journeyDataMap).length).toEqual(100)
      expect(Object.values(req.session.journeyDataMap).find(j => j.instanceUnixEpoch === epoch)).not.toBeNull()

      // create new Journey Data into map by calling the getter
      expect(req.journeyData).not.toBeNull()

      expect(Object.keys(req.session.journeyDataMap).length).toEqual(100)
      expect(Object.values(req.session.journeyDataMap).find(j => j.instanceUnixEpoch === epoch)).toBeUndefined()
    })
  })
})
