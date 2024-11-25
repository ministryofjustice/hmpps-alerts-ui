import { Request, Response, NextFunction } from 'express'
import fs, { promises as fsPromises } from 'fs'
import { parse } from 'csv-parse'
import { finished } from 'stream/promises'
import { FLASH_KEY__VALIDATION_ERRORS } from '../../../../utils/constants'
import PrisonerSearchApiClient, { Prisoner } from '../../../../data/prisonerSearchApiClient'
import { summarisePrisoner } from '../../../../utils/utils'

const PRISONER_SEARCH_CHUNK_SIZE = 1000

export const validateFile =
  (prisonerSearchApiClient: PrisonerSearchApiClient, failureUrl?: string) =>
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

    const invalidPrisonNumbers = prisonNumbers.filter(prisonNumber => !prisonNumber!.match(/^[A-z][0-9]{4}[A-z]{2}$/))

    const allPrisonNumbersToSearch = prisonNumbers.filter(prisonNumber => !invalidPrisonNumbers.includes(prisonNumber))
    const chunkCount = Math.ceil(allPrisonNumbersToSearch.length / PRISONER_SEARCH_CHUNK_SIZE)
    const prisonNumbersToSearchChunks = Array.from(Array(chunkCount).keys()).map(idx =>
      allPrisonNumbersToSearch.slice(idx * PRISONER_SEARCH_CHUNK_SIZE, (idx + 1) * PRISONER_SEARCH_CHUNK_SIZE),
    )

    const prisonersUploaded = (
      await Promise.all(
        prisonNumbersToSearchChunks.map(prisonerNumbers =>
          prisonerSearchApiClient.searchByPrisonNumbers(req.middleware.clientToken, { prisonerNumbers }),
        ),
      )
    ).flat()

    const unrecognisedNumbers = prisonNumbers.filter(
      itm => !prisonersUploaded.find(found => found.prisonerNumber === itm) && !invalidPrisonNumbers.includes(itm),
    )

    const invalidOrUnrecognisedPrisonNumberErrorMessages: string[] = []

    if (invalidPrisonNumbers.length) {
      if (invalidPrisonNumbers.length > 1) {
        invalidOrUnrecognisedPrisonNumberErrorMessages.push(
          `The following prison numbers ${invalidPrisonNumbers.map(itm => `‘${itm}’`).join(', ')} do not follow the format A1234CD`,
        )
      } else {
        invalidOrUnrecognisedPrisonNumberErrorMessages.push(
          `The prison number ‘${invalidPrisonNumbers[0]}’ does not follow the format A1234CD`,
        )
      }
    }
    if (unrecognisedNumbers.length) {
      if (unrecognisedNumbers.length > 1) {
        invalidOrUnrecognisedPrisonNumberErrorMessages.push(
          `The following prison numbers ${unrecognisedNumbers.map(itm => `‘${itm}’`).join(', ')} were not recognised`,
        )
      } else {
        invalidOrUnrecognisedPrisonNumberErrorMessages.push(
          `The prison number ‘${unrecognisedNumbers[0]}’ was not recognised`,
        )
      }
    }

    if (invalidOrUnrecognisedPrisonNumberErrorMessages.length) {
      return fail(...invalidOrUnrecognisedPrisonNumberErrorMessages)
    }

    req.body = {
      prisonersUploaded: prisonersUploaded.map(summarisePrisoner),
    }
    return next()
  }

export type SchemaType = {
  prisonersUploaded: Prisoner[]
}
