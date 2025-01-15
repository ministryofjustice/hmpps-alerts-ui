import { z } from 'zod'

const AlertTypeCodeSchema = z
  .string({
    errorMap: () => ({
      message: 'An alert type code must be an uppercase series of letters between 1-12 characters long',
    }),
  })
  .regex(/[A-Z]/)
  .min(1)
  .max(12)
const AlertTypeDescriptionSchema = z
  .string({ errorMap: () => ({ message: 'An alert type description must be between 1 and 40 characters' }) })
  .min(1)
  .max(40)

export const CreateAlertTypeRequestSchema = z
  .object({
    /**
     * @description The short code for the alert type
     * @example AABBCCDDEEFF
     * @example A
     */
    code: AlertTypeCodeSchema,

    /**
     * @description The description of the alert type
     * @example Alert code description
     */
    description: AlertTypeDescriptionSchema,
  })
  .strict()
export type CreateAlertTypeRequest = z.infer<typeof CreateAlertTypeRequestSchema>

export const UpdateAlertTypeRequestSchema = z.object({
  /**
   * @description The description of the alert code
   * @example Alert code description
   */
  description: AlertTypeDescriptionSchema,
})
export type UpdateAlertTypeRequest = z.infer<typeof UpdateAlertTypeRequestSchema>
