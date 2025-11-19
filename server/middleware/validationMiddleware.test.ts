import { z } from 'zod'
import { NextFunction, Request, Response } from 'express'
import { fail } from 'assert'
import { FLASH_KEY__VALIDATION_ERRORS } from '../utils/constants'
import {
  createSchema,
  validate,
  validateAndTransformReferenceData,
  validateTransformDate,
  validateTransformOptionalDate,
  validateTransformPastDate,
  validateTransformFutureDate,
  validateTransformDateInRange,
} from './validationMiddleware'

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => undefined)
})

it('should normalise new lines', async () => {
  const schema = createSchema({
    descriptionOfConcern: z
      .string({ message: 'Required' })
      .max(4000, 'Max')
      .refine(val => val && val.trim().length > 0, 'Required'),
  })

  const { req, res, next } = mockRequest({
    body: {
      descriptionOfConcern: 'a\r\n'.repeat(2000),
    },
    expectSuccess: true,
  })
  await validate(schema)(req, res, next)
  expect(next).toHaveBeenCalledWith()
})

describe('reference data validation', () => {
  const refData = new Map([
    ['exists1', { value: 1 }],
    ['exists2', { value: 10 }],
  ])
  const schema = createSchema({
    item: z.string().min(1, { error: 'Required' }).transform(validateAndTransformReferenceData(refData, 'Unknown')),
  })

  it.each([
    { input: 'exists1', expected: 1 },
    { input: 'exists2', expected: 10 },
  ])('should accept valid input ($input)', async ({ input, expected }) => {
    const { req, res, next } = mockRequest({
      body: { item: input },
      expectSuccess: true,
    })
    await validate(schema)(req, res, next)
    expect(next).toHaveBeenCalledWith()
    expect(req.body.item).toEqual({ value: expected })
  })

  it.each([
    { input: '', error: 'Required' },
    { input: 'missing', error: 'Unknown' },
  ])('should reject invalid input ($input)', async ({ input, error }) => {
    const { req, res, next } = mockRequest({
      body: { item: input },
      expectSuccess: false,
    })
    await validate(schema)(req, res, next)
    expect(next).not.toHaveBeenCalledWith()
    const errors = getFlashValidationErrors(req)
    expect(errors).toEqual({ item: [error] })
  })
})

describe('date validation', () => {
  const schema = createSchema({
    required: validateTransformDate('Required', 'Invalid'),
    optional: validateTransformOptionalDate('Invalid'),
  })

  describe.each([
    { input: '19/11/2025', expected: '2025-11-19' },
    { input: '19-11-2025', expected: '2025-11-19' },
    { input: '1/2/2025', expected: '2025-02-01' },
  ])('should accept valid date $input, producing $expected', ({ input, expected }) => {
    it('when optional field is provided', async () => {
      const { req, res, next } = mockRequest({
        body: { required: input, optional: input },
        expectSuccess: true,
      })
      await validate(schema)(req, res, next)
      expect(next).toHaveBeenCalledWith()
      expect(req.body.required).toEqual(expected)
      expect(req.body.optional).toEqual(expected)
    })

    it('when optional field is skipped', async () => {
      const { req, res, next } = mockRequest({
        body: { required: input, optional: '' },
        expectSuccess: true,
      })
      await validate(schema)(req, res, next)
      expect(next).toHaveBeenCalledWith()
      expect(req.body.required).toEqual(expected)
      expect(req.body.optional).toBeNull()
    })
  })

  it('should reject missing required date', async () => {
    const { req, res, next } = mockRequest({
      body: { required: '', optional: '' },
      expectSuccess: false,
    })
    await validate(schema)(req, res, next)
    expect(next).not.toHaveBeenCalledWith()
    const errors = getFlashValidationErrors(req)
    expect(errors).toEqual({ required: ['Required'] })
  })

  describe.each(['today', '11/19/2025', '29/02/2025'])('should reject invalid date %j', input => {
    it('when optional field is provided', async () => {
      const { req, res, next } = mockRequest({
        body: { required: input, optional: input },
        expectSuccess: false,
      })
      await validate(schema)(req, res, next)
      expect(next).not.toHaveBeenCalledWith()
      const errors = getFlashValidationErrors(req)
      expect(errors).toEqual({ required: ['Invalid'], optional: ['Invalid'] })
    })

    it('when optional field is skipped', async () => {
      const { req, res, next } = mockRequest({
        body: { required: input, optional: '' },
        expectSuccess: false,
      })
      await validate(schema)(req, res, next)
      expect(next).not.toHaveBeenCalledWith()
      const errors = getFlashValidationErrors(req)
      expect(errors).toEqual({ required: ['Invalid'] })
    })
  })

  describe('relative to today (fixed as 19/11/2025)', () => {
    const now = new Date('2025-11-19T12:34:56.000Z')

    beforeAll(() => {
      jest.useFakeTimers({ now })
      jest.setSystemTime(now)
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    const pastSchema = createSchema({
      date: validateTransformPastDate('Required', 'Invalid', 'Out of bounds'),
    })
    const futureSchema = createSchema({
      date: validateTransformFutureDate('Required', 'Invalid', 'Out of bounds'),
    })
    const rangeSchema = createSchema({
      date: validateTransformDateInRange('Required', 'Invalid', 'Out of bounds', 1, 2),
    })

    it.each([
      { input: '19-11-2025', expected: '2025-11-19' },
      { input: '1/9/2025', expected: '2025-09-01' },
    ])('should accept $input as a past date', async ({ input, expected }) => {
      const { req, res, next } = mockRequest({
        body: { date: input },
        expectSuccess: true,
      })
      await validate(pastSchema)(req, res, next)
      expect(next).toHaveBeenCalledWith()
      expect(req.body.date).toEqual(expected)
    })

    it.each([
      { input: '', error: 'Required' },
      { input: 'today', error: 'Invalid' },
      { input: '11/19/2025', error: 'Invalid' },
      { input: '29/02/2025', error: 'Invalid' },
      { input: '20/11/2025', error: 'Out of bounds' },
      { input: '1/1/2026', error: 'Out of bounds' },
    ])('should reject $input as a past date', async ({ input, error }) => {
      const { req, res, next } = mockRequest({
        body: { date: input },
        expectSuccess: false,
      })
      await validate(pastSchema)(req, res, next)
      expect(next).not.toHaveBeenCalledWith()
      const errors = getFlashValidationErrors(req)
      expect(errors).toEqual({ date: [error] })
    })

    it.each([
      { input: '19-11-2025', expected: '2025-11-19' },
      { input: '1/1/2026', expected: '2026-01-01' },
    ])('should accept $input as a future date', async ({ input, expected }) => {
      const { req, res, next } = mockRequest({
        body: { date: input },
        expectSuccess: true,
      })
      await validate(futureSchema)(req, res, next)
      expect(next).toHaveBeenCalledWith()
      expect(req.body.date).toEqual(expected)
    })

    it.each([
      { input: '', error: 'Required' },
      { input: 'today', error: 'Invalid' },
      { input: '11/19/2025', error: 'Invalid' },
      { input: '29/02/2025', error: 'Invalid' },
      { input: '18/11/2025', error: 'Out of bounds' },
      { input: '1/1/2025', error: 'Out of bounds' },
    ])('should reject $input as a future date', async ({ input, error }) => {
      const { req, res, next } = mockRequest({
        body: { date: input },
        expectSuccess: false,
      })
      await validate(futureSchema)(req, res, next)
      expect(next).not.toHaveBeenCalledWith()
      const errors = getFlashValidationErrors(req)
      expect(errors).toEqual({ date: [error] })
    })

    it.each([
      { input: '18/11/2025', expected: '2025-11-18' },
      { input: '19-11-2025', expected: '2025-11-19' },
      { input: '20/11/2025', expected: '2025-11-20' },
      { input: '21-11-2025', expected: '2025-11-21' },
    ])('should accept $input as within 1 day in the past and 2 days in the future', async ({ input, expected }) => {
      const { req, res, next } = mockRequest({
        body: { date: input },
        expectSuccess: true,
      })
      await validate(rangeSchema)(req, res, next)
      expect(next).toHaveBeenCalledWith()
      expect(req.body.date).toEqual(expected)
    })

    it.each([
      { input: '', error: 'Required' },
      { input: 'today', error: 'Invalid' },
      { input: '11/19/2025', error: 'Invalid' },
      { input: '29/02/2025', error: 'Invalid' },
      { input: '17/11/2025', error: 'Out of bounds' },
      { input: '22/11/2025', error: 'Out of bounds' },
      { input: '1/1/2025', error: 'Out of bounds' },
      { input: '1/1/2026', error: 'Out of bounds' },
    ])('should reject $input as within 1 day in the past and 2 days in the future', async ({ input, error }) => {
      const { req, res, next } = mockRequest({
        body: { date: input },
        expectSuccess: false,
      })
      await validate(rangeSchema)(req, res, next)
      expect(next).not.toHaveBeenCalledWith()
      const errors = getFlashValidationErrors(req)
      expect(errors).toEqual({ date: [error] })
    })
  })
})

function mockRequest<T extends object>({
  body,
  expectSuccess,
}: {
  body: T
  expectSuccess: boolean
}): { req: Request; res: Response; next: NextFunction } {
  const req = jest.fn() as unknown as Request
  req.body = body
  req.flash = jest.fn(expectSuccess ? () => fail('Unexpected flash message') : undefined)
  const res = jest.fn() as unknown as Response
  res.redirect = jest.fn(expectSuccess ? () => fail('Unexpected redirect') : undefined)
  const next: NextFunction = jest.fn(expectSuccess ? undefined : () => fail('Unexpected success'))
  return { req, res, next }
}

function getFlashValidationErrors(req: Request): object | null {
  return JSON.parse(
    jest.mocked(req.flash).mock.calls.find(([key]) => key === FLASH_KEY__VALIDATION_ERRORS)?.[1] ?? 'null',
  )
}
