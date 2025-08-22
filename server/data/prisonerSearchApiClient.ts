import { RestClient } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'

export interface Prisoner {
  prisonerNumber: string
  firstName: string
  lastName: string
  cellLocation: string
  prisonId: string
}

export default class PrisonerSearchApiClient extends RestClient {
  constructor() {
    super('Prisoner Search API', config.apis.prisonerSearchApi, logger)
  }

  async getPrisonerDetails(token: string, prisonerNumber: string): Promise<Prisoner> {
    return this.get<Prisoner>({ path: `/prisoner/${prisonerNumber}` }, token)
  }

  async searchPrisoners(
    token: string,
    payload: { prisonerIdentifier?: string; firstName?: string | undefined; lastName?: string | undefined },
  ): Promise<Prisoner[]> {
    return this.post<Prisoner[]>(
      {
        path: `/prisoner-search/match-prisoners`,
        data: payload,
      },
      token,
    )
  }

  async searchPrisonersByQueryString(token: string, query: string) {
    if (query.match(/^[A-z][0-9]{4}[A-z]{2}$/)) {
      return this.searchPrisoners(token, { prisonerIdentifier: query })
    }

    const name = query.replace(/,/g, '').split(/\s+/)

    const results = await Promise.all([
      this.searchPrisoners(token, { firstName: name[0], lastName: name[1] }),
      this.searchPrisoners(token, { firstName: name[1], lastName: name[0] }),
    ])

    return results[0].concat(results[1])
  }
}
