import RestClient from './restClient'
import config from '../config'

export interface Prisoner {
  prisonerNumber: string
  firstName: string
  lastName: string
  cellLocation: string
  prisonId: string
}

export default class PrisonerSearchApiClient {
  constructor() {}

  private static restClient(token: string): RestClient {
    return new RestClient('Prisoner Search Api Client', config.apis.prisonerSearchApi, token)
  }

  async getPrisonerDetails(token: string, prisonerNumber: string): Promise<Prisoner> {
    return PrisonerSearchApiClient.restClient(token).get<Prisoner>({ path: `/prisoner/${prisonerNumber}` })
  }

  async searchPrisoners(
    token: string,
    payload: { prisonerIdentifier?: string; firstName?: string | undefined; lastName?: string | undefined },
  ): Promise<Prisoner[]> {
    return PrisonerSearchApiClient.restClient(token).post<Prisoner[]>({
      path: `/prisoner-search/match-prisoners`,
      data: payload,
    })
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

  async searchByPrisonNumbers(token: string, payload: { prisonerNumbers: string[] }): Promise<Prisoner[]> {
    return PrisonerSearchApiClient.restClient(token).post<Prisoner[]>({
      path: `/prisoner-search/prisoner-numbers`,
      data: payload,
    })
  }
}
