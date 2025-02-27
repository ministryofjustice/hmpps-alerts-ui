import { z } from 'zod'
import { Request, Response } from 'express'
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

  validate(schema)(mockRequest, jest.fn() as unknown as Response, jest.fn())
})
