import { Request } from 'express'
import z from 'zod'
import { isBefore, parseISO } from 'date-fns'
import {
  createSchema,
  validateAndTransformReferenceData,
  validateTransformDateInRange,
  validateTransformOptionalDate,
} from '../../middleware/validationMiddleware'
import AlertsApiClient from '../../data/alertsApiClient'

export const schemaFactory = (alertsApiClient: AlertsApiClient) => async (req: Request) => {
  const types = await alertsApiClient.retrieveAlertTypes(req.middleware.clientToken, true)

  const alertTypeMap = new Map(
    types.map(type => {
      const { alertCodes, ...rest } = type
      return [type.code, rest]
    }),
  )

  const alertCodeMap = new Map(types.flatMap(type => type.alertCodes).map(code => [code.code, code]))

  return createSchema({
    prisonNumber: z.string().regex(/^[A-Z]{1}[0-9]{4}[A-Z]{2}$/, 'Enter a prison number in the format A1234CD'),
    alertType: z.string().transform(validateAndTransformReferenceData(alertTypeMap, 'Select the alert type')),
    alertCode: z.string().transform(validateAndTransformReferenceData(alertCodeMap, 'Select the alert code')),
    description: z.string().max(1000, 'The reason for creating this alert must be 1,000 characters or under'),
    activeFrom: validateTransformDateInRange(
      'Enter the alert start date',
      'The alert start date must be a real date',
      'The alert start date must be between 7 days ago and today',
      7,
      0,
    ),
    activeTo: validateTransformOptionalDate('The alert end date must be a real date'),
  }).superRefine((val, ctx) => {
    if (val.alertType?.code !== 'DOCGM' && (val.alertType as unknown as string) !== 'DOCGM' && !val.description) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter why you are creating this alert',
        path: ['description'],
      })
    }
    if (val.activeTo && isBefore(lenientParseDate(val.activeTo), lenientParseDate(val.activeFrom))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'The alert end date must be after the alert start date',
        path: ['activeTo'],
      })
    }
  })
}

const lenientParseDate = (ds: string) => {
  if (ds.match(/[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/)) {
    const value = ds.split(/[-/]/).reverse()
    // Prefix month and date with a 0 if needed
    const month = value[1]?.length === 2 ? value[1] : `0${value[1]}`
    const date = value[2]?.length === 2 ? value[2] : `0${value[2]}`
    const dateString = `${value[0]}-${month}-${date}T00:00:00Z` // We put a full timestamp on it so it gets parsed as UTC time and the date doesn't get changed due to locale
    return parseISO(dateString)
  }
  return parseISO(ds)
}

export type SchemaType = z.infer<Awaited<ReturnType<ReturnType<typeof schemaFactory>>>>
