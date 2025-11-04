import { ManageAlertRestrictionsJourney } from '../../../../@types/express'
import { AlertType } from '../../../../@types/alerts/alertsApiTypes'

export const getAlertTypeFilter = (journey: ManageAlertRestrictionsJourney): ((type: AlertType) => boolean) => {
  switch (journey.changeType) {
    case 'RESTRICT_ALERT':
      return (type: AlertType) => type.alertCodes.some(code => !code.isRestricted)
    case 'REMOVE_ALERT_RESTRICTION':
      return (type: AlertType) => type.alertCodes.some(code => code.isRestricted)
    default:
      return (type: AlertType) => type.alertCodes.length > 0
  }
}

export default { getAlertTypeFilter }
