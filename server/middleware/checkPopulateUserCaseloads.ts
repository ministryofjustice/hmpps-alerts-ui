import { RequestHandler, Router } from 'express'
import logger from '../../logger'

export default function checkPopulateUserCaseloads(): RequestHandler {
  const router = Router()

  router.use(async (_req, res, next) => {
    try {
      if (res.locals.feComponentsMeta?.caseLoads) {
        res.locals.user.caseloads = res.locals.feComponentsMeta.caseLoads
      }
      if (res.locals.feComponentsMeta?.activeCaseLoad) {
        res.locals.user.activeCaseLoadId = res.locals.feComponentsMeta.activeCaseLoad.caseLoadId
      }
    } catch (error) {
      logger.error(error, `Failed to get caseloads for: ${res.locals.user.username}`)
      next(error)
    }
    next()
  })
  return router
}
