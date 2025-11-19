import { Request } from 'express'
import { z, RefinementCtx } from 'zod'
import { isAfter } from 'date-fns'
import {
  createSchema,
  validateAndTransformReferenceData,
  validateTransformDateInRange,
  validateTransformOptionalDate,
} from '../../middleware/validationMiddleware'
import AlertsApiClient from '../../data/alertsApiClient'
import PrisonerSearchApiClient from '../../data/prisonerSearchApiClient'
import { firstNameSpaceLastName } from '../../utils/miniProfileUtils'

export const schemaFactory =
  (alertsApiClient: AlertsApiClient, prisonerSearchApiClient: PrisonerSearchApiClient) => async (req: Request) => {
    const types = await alertsApiClient.retrieveAlertTypes(req.middleware.clientToken, true)

    const alertTypeMap = new Map(
      types.map(type => {
        const { alertCodes, ...rest } = type
        return [type.code, rest]
      }),
    )

    const alertCodeMap = new Map(types.flatMap(type => type.alertCodes).map(code => [code.code, code]))

    return createSchema({
      prisonNumber: z
        .string()
        .regex(/^[A-z]{1}[0-9]{4}[A-z]{2}$/, 'Enter a prison number in the format A1234CD')
        .transform(async (val: string, ctx: RefinementCtx) => {
          try {
            return await prisonerSearchApiClient.getPrisonerDetails(req.middleware.clientToken, val.toUpperCase())
          } catch {
            ctx.addIssue(`The prison number ‘${val}’ was not recognised`)
            return z.NEVER
          }
        }),
      alertType: z.string().transform(validateAndTransformReferenceData(alertTypeMap, 'Select the alert type')),
      alertCode: z.string().transform(validateAndTransformReferenceData(alertCodeMap, 'Select the alert')),
      description: z.string().max(1000, 'The reason for creating this alert must be 1,000 characters or under'),
      activeFrom: validateTransformDateInRange(
        'Enter the alert start date',
        'The alert start date must be a real date',
        'The alert start date must be between 7 days ago and today',
        7,
        0,
      ),
      activeTo: validateTransformOptionalDate('The alert end date must be a real date'),
    })
      .refine(({ description }) => description.length > 0, {
        error: 'Enter why you are creating this alert',
        path: ['description'],
        when(payload): boolean {
          const { value, issues } = payload
          if (!value || typeof value !== 'object' || !('alertCode' in value)) {
            return false
          }
          if (
            (value.alertCode &&
              typeof value.alertCode === 'object' &&
              'code' in value.alertCode &&
              value.alertCode.code === 'DOCGM') ||
            (typeof value.alertCode === 'string' && value.alertCode === 'DOCGM')
          ) {
            return false
          }
          return issues.every(iss => iss.path?.[0] !== 'description')
        },
      })
      .refine(({ activeFrom, activeTo }) => isAfter(activeTo!, activeFrom), {
        error: 'The alert end date must be after the alert start date',
        path: ['activeTo'],
        when(payload): boolean {
          const { value, issues } = payload
          if (
            !value ||
            typeof value !== 'object' ||
            !('activeFrom' in value) ||
            !('activeTo' in value) ||
            !value.activeTo
          ) {
            return false
          }
          return issues.every(iss => iss.path?.[0] !== 'activeFrom' && iss.path?.[0] !== 'activeTo')
        },
      })
      .superRefine(async (val, ctx) => {
        const existingActiveAlerts = await alertsApiClient.getPrisonerActiveAlertForAlertCode(
          req.middleware.clientToken,
          val.prisonNumber.prisonerNumber,
          val.alertCode.code,
        )
        if (existingActiveAlerts.totalElements) {
          ctx.addIssue({
            code: 'custom',
            message: `${firstNameSpaceLastName(val.prisonNumber)} already has the ‘${val.alertCode.description}’ alert active`,
            path: ['alertCode'],
          })
        }
      })
  }

export type SchemaType = z.infer<Awaited<ReturnType<ReturnType<typeof schemaFactory>>>>
