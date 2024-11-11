import { Request, Response } from 'express'
import { SchemaType } from './schemas'
import PrisonerSearchApiClient, { Prisoner } from '../../../../data/prisonerSearchApiClient'

export default class SelectPrisonerController {
  constructor(readonly prisonerSearchApiClient: PrisonerSearchApiClient) {}

  GET = async (req: Request, res: Response) => {
    let prisoners: Prisoner[] | undefined

    if (req.journeyData.bulkAlert!.query && !res.locals.validationErrors) {
      prisoners = (
        await this.prisonerSearchApiClient.searchPrisonersByQueryString(
          req.middleware.clientToken,
          req.journeyData.bulkAlert!.query!,
        )
      ).slice(0, 50)
      req.journeyData.bulkAlert!.prisonersSearched = prisoners
    } else if (res.locals.validationErrors?.selectedPrisoner) {
      prisoners = req.journeyData.bulkAlert!.prisonersSearched
    }

    res.render('bulk-alerts/select-prisoner/view', {
      prisoners,
      query: res.locals.formResponses?.['query'] ?? req.journeyData.bulkAlert!.query,
      backUrl: 'how-to-add-prisoners',
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    req.journeyData.bulkAlert!.prisonersSelected ??= []
    req.journeyData.bulkAlert!.prisonersSelected!.push(req.body.selectedPrisoner)
    delete req.journeyData.bulkAlert!.query
    delete req.journeyData.bulkAlert!.prisonersSearched
    res.redirect('review-prisoners')
  }
}