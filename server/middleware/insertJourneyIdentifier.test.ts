import { randomUUID } from 'node:crypto'
import type { Request, Response } from 'express'
import insertJourneyIdentifier from './insertJourneyIdentifier'

describe('insertJourneyIdentifier', () => {
  const uuid = randomUUID()

  it.each([`/${uuid}`, `/${uuid}/update`, `/${uuid}/update/123`])(
    'should call next when url has a journey identifier like %j',
    url => {
      const { res, next } = mockRequest(url)

      expect(res.redirect).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    },
  )

  it.each(['', '/', '/update', '/update/123', `/update/${uuid}`])(
    'should redirect since url %j does not contain a journey identifier',
    url => {
      const { res, next } = mockRequest(url)

      expect(res.redirect).toHaveBeenCalled()
      const [redirectUrl] = jest.mocked(res.redirect).mock.calls[0] as unknown as [string]
      expect(redirectUrl.startsWith('http://localhost/')).toBe(true)
      expect(redirectUrl.endsWith(url)).toBe(true)
      expect(next).not.toHaveBeenCalled()
    },
  )
})

function mockRequest(url: string) {
  const req = { baseUrl: 'http://localhost', url } as unknown as Request
  const res = { redirect: jest.fn() } as unknown as Response
  const next = jest.fn()
  const middleware = insertJourneyIdentifier()
  middleware(req, res, next)
  return { req, res, next }
}
