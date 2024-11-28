import { Request, Response, NextFunction } from 'express'
import fs, { promises as fsPromises } from 'fs'
import { parse } from 'csv-parse'
import { finished } from 'stream/promises'
import { FLASH_KEY__VALIDATION_ERRORS } from '../../../../utils/constants'
import AlertsApiClient from '../../../../data/alertsApiClient'

export const validateFileAndSubmitPrisonerList =
  (alertsApiClient: AlertsApiClient, failureUrl?: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const fail = (...messages: string[]) => {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }
      req.flash(
        FLASH_KEY__VALIDATION_ERRORS,
        JSON.stringify({
          file: messages,
        }),
      )
      return res.redirect(failureUrl ?? 'back')
    }

    if (!req.file) {
      return fail('You must select a file')
    }
    if (req.file.size === 0) {
      return fail('The selected file does not contain any prison numbers')
    }

    let fileData
    try {
      fileData = await fsPromises.readFile(req.file.path)
      fs.unlinkSync(req.file.path)
    } catch {
      return fail('The selected file could not be uploaded – try again')
    }

    const rowValues: string[][] = []

    const parser = parse(fileData!, { trim: true, skipEmptyLines: true, bom: true }).on('readable', () => {
      let row
      // eslint-disable-next-line no-cond-assign
      while ((row = parser.read())) {
        const [prisonerNumber] = row
        if (
          prisonerNumber &&
          prisonerNumber !== 'Prison number' &&
          !rowValues.map(i => i[0]).includes(prisonerNumber)
        ) {
          rowValues.push(row)
        }
      }
    })

    try {
      await finished(parser)
    } catch {
      return fail('The selected file must use the CSV template')
    }

    const prisonNumbers = rowValues.map(row => row[0]).filter(Boolean) as string[]

    if (prisonNumbers.length === 0) {
      return fail('The selected file does not contain any prison numbers')
    }

    try {
      await alertsApiClient.addPrisonersToBulkAlertsPlan(
        req.middleware.clientToken,
        req.journeyData.bulkAlert!.planId!,
        prisonNumbers,
      )
    } catch (e: unknown) {
      const error = e as { text?: string }
      const errorRespData = JSON.parse(error?.text || '{}') as { userMessage?: string }
      if (errorRespData?.userMessage) {
        return fail(errorRespData.userMessage)
      }
      return next(e)
    }

    return next()
  }
