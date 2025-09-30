import { RequestHandler, Router } from 'express'

const BaseRouter = () => {
  const router = Router({ mergeParams: true })

  const get = (path: string, ...handlers: RequestHandler[]) =>
    router.get(path, ...handlers.slice(0, -1), handlers.slice(-1)[0]!)
  const post = (path: string, ...handlers: RequestHandler[]) =>
    router.post(path, ...handlers.slice(0, -1), handlers.slice(-1)[0]!)

  return {
    router,
    get,
    post,
  }
}

export default BaseRouter
