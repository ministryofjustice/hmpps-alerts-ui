import { RequestHandler } from 'express'
import logger from '../../logger'
import { dataAccess } from '../data'

export default function populateClientToken(): RequestHandler {
  const { hmppsAuthClient } = dataAccess()

  return async (req, res, next) => {
    if (!req.middleware) {
      req.middleware = { ...req.middleware }
    }
    try {
      if (res.locals.user) {
        const clientToken = await hmppsAuthClient.getSystemClientToken(res.locals.user.username)
        if (clientToken) {
          req.middleware.clientToken = clientToken
        } else {
          logger.info('No client token available')
        }
      }
      next()
    } catch (error) {
      logger.error(error, `Failed to retrieve client token for: ${res.locals.user && res.locals.user.username}`)
      next(error)
    }
  }
}
