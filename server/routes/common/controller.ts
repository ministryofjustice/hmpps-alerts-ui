import { Request } from 'express'
import AlertsApiClient from '../../data/alertsApiClient'
import { AlertCode, AlertType } from '../../@types/alerts/alertsApiTypes'
import type { SelectOption } from '../../utils/viewUtils'

export default abstract class BaseController {
  constructor(readonly alertsApiService: AlertsApiClient) {}

  /**
   * Map AlertType array into structures suitable for using in type > code dropdowns.
   *
   * @param req - express request
   * @param type - preselected alert type to determine list of codes
   * @param existingAlertCodes
   * @param includeInactive
   * @param excludeRestricted - exclude restricted alert codes the current user is not a privileged user for
   */
  mapAlertTypes = async ({
    req,
    type,
    existingAlertCodes,
    includeInactive,
    excludeRestricted,
  }: {
    req: Request
    type?: string
    existingAlertCodes?: string[]
    includeInactive?: boolean
    excludeRestricted?: boolean
  }) => {
    const retrievedTypes = await this.alertsApiService.retrieveAlertTypes(req.middleware.clientToken, includeInactive)
    const types = excludeRestricted
      ? retrievedTypes.map(t => ({
          ...t,
          alertCodes: t.alertCodes.filter(code => !code.isRestricted || code.canBeAdministered),
        }))
      : retrievedTypes
    const alertTypes = this.mapActiveSortedAlertTypes(
      types.filter(t => t.alertCodes.length),
      undefined,
      includeInactive,
    )

    const typeCodeMap: Record<string, SelectOption[]> = types.reduce(
      (ts, t) => ({
        ...ts,
        [t.code]: this.mapActiveSortedAlertTypes(t.alertCodes, existingAlertCodes, includeInactive),
      }),
      {},
    )

    let alertCodes: SelectOption[] = []
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
  ): SelectOption[] {
    return alertTypes
      ?.filter(alertType => includeInactive || alertType.isActive)
      .map<SelectOption>(alertType => {
        return {
          value: alertType.code,
          text: alertType.description,
          attributes: existingAlertCodes?.includes(alertType.code) ? { disabled: 'disabled' } : undefined,
        }
      })
      .sort((a, b) => a.text.localeCompare(b.text))
  }
}
