import { ManageAlertRestrictionsJourney } from '../../../../@types/express'
import { AlertCode } from '../../../../@types/alerts/alertsApiTypes'

export const getAlertCodeFilter = (journey: ManageAlertRestrictionsJourney): ((code: AlertCode) => boolean) => {
  switch (journey.changeType) {
    case 'RESTRICT_ALERT':
      return (code: AlertCode) => !code.isRestricted
    case 'REMOVE_ALERT_RESTRICTION':
      return (code: AlertCode) => code.isRestricted
    default:
      return (_code: AlertCode) => true
  }
}

export default { getAlertCodeFilter }
