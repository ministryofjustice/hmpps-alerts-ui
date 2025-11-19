import { z, RefinementCtx } from 'zod'
import { Request, Response } from 'express'
import { createSchema } from '../../../../middleware/validationMiddleware'

const ERROR_MSG = 'You must select one option'

export const schemaFactory = async (req: Request, _res: Response) => {
  return createSchema({
    selectedPrisoner: z.string({ error: ERROR_MSG }).transform((val: string, ctx: RefinementCtx) => {
      const prisoner = req.journeyData.bulkAlert?.prisonersSearched?.find(itm => itm.prisonerNumber === val)
      if (!prisoner) {
        ctx.addIssue(ERROR_MSG)
        return z.NEVER
      }
      return prisoner!
    }),
  })
}

export type SchemaType = z.infer<Awaited<ReturnType<typeof schemaFactory>>>
