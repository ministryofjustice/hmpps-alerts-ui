import z from 'zod'

const AlertCodeCodeSchema = z
  .string({
    errorMap: () => ({ message: 'An alert code must be an uppercase series of letters between 1-12 characters long' }),
  })
  .regex(/[A-Z]/)
  .min(1)
  .max(12)
const AlertCodeDescriptionSchema = z
  .string({ errorMap: () => ({ message: 'An alert code description must be between 1 and 40 characters' }) })
  .min(1)
  .max(40)

export const CreateAlertCodeRequestSchema = z.object({
  /**
   * @description The short code for the alert code
   * @example AABBCCDDEEFF
   * @example A
   */
  code: AlertCodeCodeSchema,

  /**
   * @description The description of the alert code
   * @example Alert code description
   */
  description: AlertCodeDescriptionSchema,

  /**
   * @description The short code for the parent type
   * @example AABBCCDDEEFF
   * @example A
   */
  parent: AlertCodeCodeSchema,
})
export type CreateAlertCodeRequest = z.infer<typeof CreateAlertCodeRequestSchema>

export const UpdateAlertCodeRequestSchema = z.object({
  /**
   * @description The description of the alert code
   * @example Alert code description
   */
  description: AlertCodeDescriptionSchema,
})
export type UpdateAlertCodeRequest = z.infer<typeof UpdateAlertCodeRequestSchema>
