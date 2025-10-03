import { Router } from 'express'

interface BaseRouter {
  router: Router
  get: Router['get']
  post: Router['post']
}

const BaseRouter = (): BaseRouter => {
  const router = Router({ mergeParams: true })

  return {
    router,
    get: router.get.bind(router),
    post: router.post.bind(router),
  }
}

export default BaseRouter
