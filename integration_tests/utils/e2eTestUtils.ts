import { JourneyData } from '../../server/@types/express'

type RecursivePartial<T> = T extends unknown
  ? T extends object
    ? { [K in keyof T]?: RecursivePartial<T[K]> }
    : T
  : never

export default function injectJourneyDataAndReload(uuid: string, json: RecursivePartial<JourneyData>) {
  const data = encodeURIComponent(btoa(JSON.stringify(json)))
  cy.request('GET', `/${uuid}/inject-journey-data?data=${data}`)
  cy.reload()
}
