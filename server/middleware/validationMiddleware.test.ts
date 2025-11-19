import { z } from 'zod'
import { NextFunction, Request, Response } from 'express'
import { fail } from 'assert'
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
