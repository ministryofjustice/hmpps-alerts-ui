import { randomUUID } from 'node:crypto'
import type { RequestHandler } from 'express'
import { validateUuid } from '../utils/validateUuid'

export default function insertJourneyIdentifier(): RequestHandler {
  return (req, res, next): void => {
    const uuid = req.url.split('/')[1] || '/'
    if (!validateUuid(uuid)) {
      res.redirect(`${req.baseUrl}/${randomUUID()}${req.url}`)
      return
    }
    next()
  }
}
