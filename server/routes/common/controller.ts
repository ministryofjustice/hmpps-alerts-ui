import { Request } from 'express'
import AlertsApiClient from '../../data/alertsApiClient'
import { AlertCode, AlertType } from '../../@types/alerts/alertsApiTypes'

export default class BaseController {
  constructor(readonly alertsApiService: AlertsApiClient) {}

  getAlertTypesForRadios = async (req: Request, includeInactive?: boolean, value?: AlertType | string) => [
    ...(await this.alertsApiService.retrieveAlertTypes(req.middleware.clientToken, includeInactive)).map(refData => ({
      value: refData.code,
      text: refData.description,
      checked: typeof value === 'string' ? refData.code === value : refData.code === value?.code,
    })),
  ]

  getAlertTypesForSelect = async (req: Request, includeInactive?: boolean, value?: AlertType | string) => [
    {
      value: '',
      text: 'Choose alert type',
      selected: !value,
    },
    ...(await this.alertsApiService.retrieveAlertTypes(req.middleware.clientToken, includeInactive)).map(refData => ({
      value: refData.code,
      text: refData.description,
      selected: typeof value === 'string' ? refData.code === value : refData.code === value?.code,
    })),
  ]

  /**
   * Map AlertType array into structures suitable for using in type > code dropdowns.
   *
   * @param req - express request
   * @param type - preselected alert type to determine list of codes
   * @param existingAlertCodes
   * @param includeInactive
   */
  mapAlertTypes = async ({
    req,
    type,
    existingAlertCodes,
    includeInactive,
  }: {
    req: Request
    type?: string
    existingAlertCodes?: string[]
    includeInactive?: boolean
  }) => {
    const types = await this.alertsApiService.retrieveAlertTypes(req.middleware.clientToken, includeInactive)
    const alertTypes = this.mapActiveSortedAlertTypes(
      types.filter(t => t.alertCodes.length),
      undefined,
      includeInactive,
    )

    const typeCodeMap: { [key: string]: { value: string; text: string }[] } = types.reduce(
      (ts, t) => ({
        ...ts,
        [t.code]: this.mapActiveSortedAlertTypes(t.alertCodes, existingAlertCodes, includeInactive),
      }),
      {},
    )

    let alertCodes: { value: string; text: string }[] = []
    if (type) {
      const selectedType = types.find(t => t.code === type)
      if (selectedType) {
        alertCodes = this.mapActiveSortedAlertTypes(selectedType.alertCodes, existingAlertCodes, includeInactive)
      }
    }
    return { alertTypes, alertCodes, typeCodeMap }
  }

  private mapActiveSortedAlertTypes(
    alertTypes: (AlertType | AlertCode)[],
    existingAlertCodes?: string[],
    includeInactive?: boolean,
  ): { text: string; value: string }[] {
    return alertTypes
      ?.filter(alertType => includeInactive || alertType.isActive)
      .map(alertType => {
        return {
          value: alertType.code,
          text: alertType.description,
          attributes: existingAlertCodes?.includes(alertType.code) ? { disabled: 'disabled' } : undefined,
        }
      })
      .sort((a, b) => a.text.localeCompare(b.text))
  }
}
