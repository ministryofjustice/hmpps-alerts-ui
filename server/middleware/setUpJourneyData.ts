import { RequestHandler } from 'express'

const MAX_CONCURRENT_JOURNEYS = 100

export default function setUpJourneyData(): RequestHandler {
  return async (req, _, next) => {
    Object.defineProperty(req, 'journeyData', {
      get() {
        req.session.journeyDataMap ??= {}

        const journeyId = req.params['journeyId'] ?? 'default'
        if (!req.session.journeyDataMap[journeyId]) {
          req.session.journeyDataMap[journeyId] = { instanceUnixEpoch: Date.now() }

          if (Object.keys(req.session.journeyDataMap).length > MAX_CONCURRENT_JOURNEYS) {
            const oldestKey = Object.entries(req.session.journeyDataMap).reduce((a, b) =>
              a[1].instanceUnixEpoch < b[1].instanceUnixEpoch ? a : b,
            )[0]
            delete req.session.journeyDataMap[oldestKey]
          }
        }
        return req.session.journeyDataMap[journeyId]
      },
    })
    next()
  }
}
