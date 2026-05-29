import { RequestHandler } from 'express'

export default function forAllGetRequests(middleware: RequestHandler): RequestHandler {
  return (req, res, next) => {
    if (req.method === 'GET') {
      return middleware(req, res, next)
    }
    return next()
  }
}
