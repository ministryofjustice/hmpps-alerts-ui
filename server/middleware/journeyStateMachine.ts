import { Router, NextFunction, Request, Response } from 'express'

const journeyStateMachine = () => {
  const router = Router({ mergeParams: true })

  router.use((req: Request, res: Response, next: NextFunction) => {
    const resRender = res.render
    res.render = (view: string, options?) => {
      if (req.journeyData?.journeyCompleted && !view.endsWith('/confirmation/view')) {
        res.redirect(`confirmation`)
        return
      }
      resRender.call(res, view, options as never)
    }
    next()
  })
  return router
}

export default journeyStateMachine
