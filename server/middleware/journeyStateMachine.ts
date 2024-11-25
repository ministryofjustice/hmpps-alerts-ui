import { Router, NextFunction, Request, Response } from 'express'

const journeyStateMachine = () => {
  const router = Router({ mergeParams: true })

  router.use((req: Request, res: Response, next: NextFunction) => {
    if (req.journeyData?.journeyCompleted && !req.originalUrl.match(/\/confirmation$/)) {
      res.redirect(`confirmation`)
      return
    }
    next()
  })
  return router
}

export default journeyStateMachine
