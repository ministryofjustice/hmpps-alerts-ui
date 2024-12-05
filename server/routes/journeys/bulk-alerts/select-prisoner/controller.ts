import { NextFunction, Request, Response } from 'express'
import { SchemaType } from './schemas'
import PrisonerSearchApiClient, { Prisoner } from '../../../../data/prisonerSearchApiClient'
import { summarisePrisoner } from '../../../../utils/utils'
import AlertsApiClient from '../../../../data/alertsApiClient'

export default class SelectPrisonerController {
  constructor(
    readonly prisonerSearchApiClient: PrisonerSearchApiClient,
    readonly alertsApiClient: AlertsApiClient,
  ) {}

  GET = async (req: Request, res: Response) => {
    let prisoners: Prisoner[] | undefined

    if (req.journeyData.bulkAlert!.query && !res.locals.validationErrors) {
      prisoners = (
        await this.prisonerSearchApiClient.searchPrisonersByQueryString(
          req.middleware.clientToken,
          req.journeyData.bulkAlert!.query!,
        )
      )
        .slice(0, 50)
        .map(summarisePrisoner)
      req.journeyData.bulkAlert!.prisonersSearched = prisoners
    } else if (res.locals.validationErrors?.selectedPrisoner) {
      prisoners = req.journeyData.bulkAlert!.prisonersSearched
    }

    res.render('bulk-alerts/select-prisoner/view', {
      prisoners,
      alertCode: req.journeyData.bulkAlert!.alertCode,
      query: res.locals.formResponses?.['query'] ?? req.journeyData.bulkAlert!.query,
      backUrl: req.journeyData.isCheckAnswers ? 'review-prisoners' : 'how-to-add-prisoners',
    })
  }

  UPDATE_BACKEND_SESSION = async (req: Request<unknown, unknown, SchemaType>, _res: Response, next: NextFunction) => {
    await this.alertsApiClient.addPrisonersToBulkAlertsPlan(
      req.middleware.clientToken,
      req.journeyData.bulkAlert!.planId!,
      [req.body.selectedPrisoner.prisonerNumber],
    )
    next()
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    delete req.journeyData.bulkAlert!.query
    delete req.journeyData.bulkAlert!.prisonersSearched
    res.redirect('review-prisoners')
  }
}
