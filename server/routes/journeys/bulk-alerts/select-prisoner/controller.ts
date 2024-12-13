import { NextFunction, Request, Response } from 'express'
import { SchemaType } from './schemas'
import PrisonerSearchApiClient, { Prisoner } from '../../../../data/prisonerSearchApiClient'
import { summarisePrisoner } from '../../../../utils/utils'
import AlertsApiClient from '../../../../data/alertsApiClient'
import AuditService from '../../../../services/auditService'

export default class SelectPrisonerController {
  constructor(
    readonly prisonerSearchApiClient: PrisonerSearchApiClient,
    readonly alertsApiClient: AlertsApiClient,
    readonly auditService: AuditService,
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

  UPDATE_BACKEND_SESSION = async (req: Request<unknown, unknown, SchemaType>, res: Response, next: NextFunction) => {
    try {
      await this.auditService.logModificationApiCall(
        'ATTEMPT',
        'UPDATE',
        req.originalUrl,
        req.journeyData,
        res.locals.auditEvent,
      )
    } catch (e: unknown) {
      next(e)
    }
    await this.alertsApiClient.addPrisonersToBulkAlertsPlan(
      req.middleware.clientToken,
      req.journeyData.bulkAlert!.planId!,
      [req.body.selectedPrisoner.prisonerNumber],
    )
    try {
      await this.auditService.logModificationApiCall(
        'SUCCESS',
        'UPDATE',
        req.originalUrl,
        req.journeyData,
        res.locals.auditEvent,
      )
    } catch (e: unknown) {
      next(e)
    }
    next()
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    delete req.journeyData.bulkAlert!.query
    delete req.journeyData.bulkAlert!.prisonersSearched
    res.redirect('review-prisoners')
  }
}
