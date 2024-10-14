import RestClient from './restClient'
import config from '../config'

interface Prisoner {
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
}
