import { randomUUID } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'
import { validateUuid } from '../utils/validateUuid'

export default function insertJourneyIdentifier() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const uuid = req.url.split('/')[1] || '/'
    if (!validateUuid(uuid)) {
      return res.redirect(`${req.baseUrl}/${randomUUID()}${req.url}`)
    }
    return next()
  }
}
