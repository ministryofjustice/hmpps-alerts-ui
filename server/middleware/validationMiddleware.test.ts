import { z } from 'zod/v3'
import { NextFunction, Request, Response } from 'express'
import { fail } from 'assert'
import { FLASH_KEY__VALIDATION_ERRORS } from '../utils/constants'
import { createSchema, validate } from './validationMiddleware'

it('should normalise new lines', async () => {
  const schema = createSchema({
    descriptionOfConcern: z
      .string({ message: 'Required' })
      .max(4000, 'Max')
      .refine(val => val && val.trim().length > 0, 'Required'),
  })

  const mockRequest = jest.fn() as unknown as Request

  mockRequest.body = {
    descriptionOfConcern: 'a\r\n'.repeat(2000),
  }

  mockRequest.flash = () => fail('Validation failed')

  const res = jest.fn() as unknown as Response
  res.redirect = () => fail('Validation failed')
  const next: NextFunction = jest.fn()

  await validate(schema)(mockRequest, res, next)

  expect(next).toHaveBeenCalled()
})

it('should always refine', async () => {
  const schema = createSchema({
    low: z.number({ message: 'Required' }),
    high: z.number({ message: 'Required' }),
    message: z.string({ message: 'Required' }).min(10, { message: 'Too short' }),
  }).superRefine(({ low, high }, ctx) => {
    // NB: zod does not normally call superRefine if inner schema failed
    if (low > high) {
      ctx.addIssue({ code: 'custom', message: 'low must be lower than high', path: ['low'] })
    }
  })

  const req = jest.fn() as unknown as Request
  req.body = {
    low: 3,
    high: 2,
    message: 'too short',
  }
  req.flash = jest.fn()
  const res = jest.fn() as unknown as Response
  res.redirect = jest.fn()
  const next: NextFunction = jest.fn()

  await validate(schema)(req, res, next)

  expect(next).not.toHaveBeenCalled()
  expect(res.redirect).toHaveBeenCalled()
  const errors = JSON.parse(
    jest.mocked(req.flash).mock.calls.find(([key]) => key === FLASH_KEY__VALIDATION_ERRORS)?.[1] ?? '{}',
  )
  expect(errors).toEqual({
    low: [expect.stringContaining('low must be lower than high')],
    message: ['Too short'],
  })
})
