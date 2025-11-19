import { RequestHandler, Request, Response } from 'express'
import { z, RefinementCtx } from 'zod'
import { isValid, isBefore, parseISO, isAfter, isEqual, subDays, addDays } from 'date-fns'
import { FLASH_KEY__FORM_RESPONSES, FLASH_KEY__VALIDATION_ERRORS } from '../utils/constants'

export type fieldErrors = {
  [field: string | number | symbol]: string[] | undefined
}
export const buildErrorSummaryList = (array: fieldErrors) => {
  if (!array) return null
  return Object.entries(array).flatMap(([field, error]) =>
    (error as string[]).map(message => ({
      text: message,
      href: `#${field}`,
    })),
  )
}

export const findError = (errors: fieldErrors, fieldName: string) => {
  if (!errors?.[fieldName]) {
    return null
  }
  if (errors[fieldName] && errors[fieldName]!.length > 1) {
    return {
      html: errors[fieldName]!.join('<br/>'),
    }
  }
  return {
    text: errors[fieldName]?.[0],
  }
}

export const customErrorOrderBuilder = (errorSummaryList: { href: string }[], order: string[]) =>
  order.map(key => errorSummaryList.find(error => error.href === `#${key}`)).filter(Boolean)

export const createSchema = <T>(shape: T) => z.strictObject({ _csrf: z.string().optional(), ...shape })

export const validateAndTransformReferenceData =
  <T>(refDataMap: Map<string, T>, errorMessage: string) =>
  (val: string, ctx: RefinementCtx) => {
    if (!refDataMap.has(val)) {
      ctx.addIssue({
        code: 'custom',
        message: errorMessage,
      })
      return z.NEVER
    }
    return refDataMap.get(val)!
  }

export type SchemaFactory = (request: Request, res: Response) => Promise<z.ZodTypeAny>

const normaliseNewLines = (body: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(body).map(([k, v]) => [k, typeof v === 'string' ? v.replace(/\r\n/g, '\n') : v]),
  )
}

export const validate = (schema: z.ZodTypeAny | SchemaFactory, failureUrl?: string): RequestHandler => {
  return async (req, res, next) => {
    if (!schema) {
      return next()
    }
    const resolvedSchema = typeof schema === 'function' ? await schema(req, res) : schema
    const result = await resolvedSchema.safeParseAsync(normaliseNewLines(req.body))
    if (result.success) {
      req.body = result.data
      return next()
    }
    req.flash(FLASH_KEY__FORM_RESPONSES, JSON.stringify(req.body))

    const deduplicatedFieldErrors = Object.fromEntries(
      Object.entries(z.flattenError(result.error).fieldErrors).map(([key, value]) => [
        key,
        [...new Set((value as unknown[] | undefined) || [])],
      ]),
    )
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'e2e-test') {
      // eslint-disable-next-line no-console
      console.error(
        `There were validation errors: ${JSON.stringify(z.treeifyError(result.error))} || body was: ${JSON.stringify(req.body)}`,
      )
    }
    req.flash(FLASH_KEY__VALIDATION_ERRORS, JSON.stringify(deduplicatedFieldErrors))

    return res.redirect(failureUrl ?? req.originalUrl)
  }
}

const validateDateBase = (requiredErr: string, invalidErr: string) =>
  z
    .string({ error: requiredErr })
    .min(1, { error: requiredErr })
    .transform(value => value.split(/[-/]/).reverse())
    .transform(value => {
      // Prefix month and date with a 0 if needed
      const month = value[1]?.length === 2 ? value[1] : `0${value[1]}`
      const date = value[2]?.length === 2 ? value[2] : `0${value[2]}`
      return `${value[0]}-${month}-${date}T00:00:00Z` // We put a full timestamp on it so it gets parsed as UTC time and the date doesn't get changed due to locale
    })
    .transform(date => parseISO(date))
    .refine(date => isValid(date), { error: invalidErr })

const validateDateOptional = (invalidErr: string) =>
  z
    .string()
    .transform(val => {
      if (val) {
        const value = val.split(/[-/]/).reverse()
        // Prefix month and date with a 0 if needed
        const month = value[1]?.length === 2 ? value[1] : `0${value[1]}`
        const date = value[2]?.length === 2 ? value[2] : `0${value[2]}`
        const dateString = `${value[0]}-${month}-${date}T00:00:00Z` // We put a full timestamp on it so it gets parsed as UTC time and the date doesn't get changed due to locale
        return parseISO(dateString)
      }
      return null
    })
    .refine(date => date === null || isValid(date), { error: invalidErr })

export const validateTransformDate = (requiredErr: string, invalidErr: string) => {
  return validateDateBase(requiredErr, invalidErr).transform(date => date.toISOString().substring(0, 10))
}

export const validateTransformOptionalDate = (invalidErr: string) => {
  return validateDateOptional(invalidErr).transform(date => (date ? date.toISOString().substring(0, 10) : null))
}

export const validateTransformPastDate = (requiredErr: string, invalidErr: string, maxErr: string) => {
  return validateDateBase(requiredErr, invalidErr)
    .superRefine((date, ctx) => {
      if (!isBefore(date, new Date())) {
        ctx.addIssue({ code: 'custom', message: maxErr })
      }
    })
    .transform(date => date.toISOString().substring(0, 10))
}

export const validateTransformFutureDate = (requiredErr: string, invalidErr: string, maxErr: string) => {
  return validateDateBase(requiredErr, invalidErr)
    .superRefine((date, ctx) => {
      const today = new Date()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      today.setMilliseconds(0)
      if (!(isAfter(date, today) || isEqual(date, today))) {
        ctx.addIssue({ code: 'custom', message: maxErr })
      }
    })
    .transform(date => date.toISOString().substring(0, 10))
}

export const validateTransformDateInRange = (
  requiredErr: string,
  invalidErr: string,
  maxErr: string,
  pastDays: number,
  futureDays: number,
) => {
  return validateDateBase(requiredErr, invalidErr)
    .superRefine((date, ctx) => {
      const today = new Date()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      today.setMilliseconds(0)

      const past = subDays(today, pastDays)
      const future = addDays(today, futureDays + 1)

      if (isBefore(date, past) || isAfter(date, future) || isEqual(date, future)) {
        ctx.addIssue({ code: 'custom', message: maxErr })
      }
    })
    .transform(date => date.toISOString().substring(0, 10))
}
