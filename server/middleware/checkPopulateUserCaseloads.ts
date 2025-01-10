import { RequestHandler, Router } from 'express'

export default function checkPopulateUserCaseloads(): RequestHandler {
  const router = Router()

  router.use(async (_req, res, next) => {
    if (res.locals.feComponents?.sharedData?.caseLoads) {
      res.locals.user.caseloads = res.locals.feComponents.sharedData.caseLoads
    }
    if (res.locals.feComponents?.sharedData?.activeCaseLoad) {
      res.locals.user.activeCaseLoadId = res.locals.feComponents.sharedData.activeCaseLoad.caseLoadId
    }
    next()
  })
  return router
}
