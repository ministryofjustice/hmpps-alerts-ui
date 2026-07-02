import { Request, Response } from 'express'
import forAllGetRequests from './forAllGetRequests'

describe('forAllGetRequests', () => {
  it('Calls the middleware given a GET request', () => {
    const middlewareSpy = jest.fn()
    const nextSpy = jest.fn()
    const req = { path: 'path', method: 'GET' } as Request

    forAllGetRequests(middlewareSpy)(req, {} as Response, nextSpy)

    expect(middlewareSpy).toHaveBeenCalledWith(req, {}, nextSpy)
    expect(nextSpy).not.toHaveBeenCalled()
  })

  it.each(['POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'])(
    'Skips the middleware and calls next for a %s request',
    method => {
      const middlewareSpy = jest.fn()
      const nextSpy = jest.fn()
      const req = { path: 'path', method } as Request

      forAllGetRequests(middlewareSpy)(req, {} as Response, nextSpy)

      expect(middlewareSpy).not.toHaveBeenCalled()
      expect(nextSpy).toHaveBeenCalled()
    },
  )
})
