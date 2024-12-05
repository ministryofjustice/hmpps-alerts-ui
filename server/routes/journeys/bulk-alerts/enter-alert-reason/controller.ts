import { Request, Response } from 'express'
import { SchemaType } from './schemas'

export default class EnterAlertReasonController {
  GET = async (req: Request, res: Response) => {
    const description = res.locals.formResponses?.['description'] ?? req.journeyData.bulkAlert!.description

    res.render('bulk-alerts/enter-alert-reason/view', {
      description,
      backUrl:
        req.journeyData.isCheckAnswers && req.journeyData.bulkAlert!.alertCodeSubJourney === undefined
          ? 'check-answers'
          : '../bulk-alerts',
    })
  }

  POST = (req: Request<unknown, unknown, SchemaType>, res: Response) => {
    req.journeyData.bulkAlert!.description = req.body.description
    if (req.journeyData.bulkAlert!.alertCodeSubJourney) {
      req.journeyData.bulkAlert!.alertType = req.journeyData.bulkAlert!.alertCodeSubJourney.alertType!
      req.journeyData.bulkAlert!.alertCode = req.journeyData.bulkAlert!.alertCodeSubJourney.alertCode!
      delete req.journeyData.bulkAlert!.alertCodeSubJourney
    }
    if (req.journeyData.isCheckAnswers) {
      res.redirect('check-answers')
    } else if (req.journeyData.bulkAlert!.prisonersSelectedCount) {
      res.redirect('review-prisoners')
    } else {
      res.redirect('how-to-add-prisoners')
    }
  }
}
