import { RequestHandler } from 'express'
import { validate } from 'uuid'
import AuditService from '../services/auditService'

export const auditPageViewMiddleware = (auditService: AuditService): RequestHandler => {
  return async (req, res, next) => {
    const hasJourneyId = validate(req.originalUrl.split('/')[1])
    let pageNameSuffix = req.originalUrl.replace(/\?.*/, '')
    const splitUrl = pageNameSuffix.toUpperCase().split('/')
    if (hasJourneyId) {
      pageNameSuffix = `${splitUrl.slice(2).join('/')}`
    }
    if (pageNameSuffix[0] === '/') {
      pageNameSuffix = pageNameSuffix.slice(1)
    }
    if (pageNameSuffix.length === 0) {
      pageNameSuffix = 'HOMEPAGE'
    }
    res.locals.auditEvent = {
      pageNameSuffix: pageNameSuffix.replace('/', '_').replace('-', '_').toLowerCase(),
      who: res.locals.user.username,
      correlationId: req.id,
      details: {},
    }

    res.prependOnceListener('close', async () => {
      await auditService.logPageView(req.journeyData, req.query, res.locals.auditEvent, `ACCESS_ATTEMPT_`)
    })

    type resRenderCb = (view: string, options?: object, callback?: (err: Error, html: string) => void) => void
    const resRender = res.render as resRenderCb
    res.render = (view: string, options?) => {
      resRender.call(res, view, options, async (err: Error, html: string) => {
        if (err) {
          res.status(500).send(err)
          return
        }
        await auditService.logPageView(req.journeyData, req.query, res.locals.auditEvent)
        res.send(html)
      })
    }
    next()
  }
}
