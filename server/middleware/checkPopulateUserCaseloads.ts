import { RequestHandler, Router } from 'express'

export default function checkPopulateUserCaseloads(): RequestHandler {
  const router = Router()

  router.use(async (_req, res, next) => {
    if (res.locals.feComponentsMeta?.caseLoads) {
      res.locals.user.caseloads = res.locals.feComponentsMeta.caseLoads
    }
    if (res.locals.feComponentsMeta?.activeCaseLoad) {
      res.locals.user.activeCaseLoadId = res.locals.feComponentsMeta.activeCaseLoad.caseLoadId
    }
    next()
  })
  return router
}
