import { UpdateReferenceDataJourney } from '../../../../@types/express'
import { AlertType } from '../../../../@types/alerts/alertsApiTypes'

export const getAlertTypeFilter = (journey: UpdateReferenceDataJourney): ((type: AlertType) => boolean) => {
  if (journey.referenceDataType === 'ALERT_TYPE') {
    switch (journey.changeType) {
      case 'DEACTIVATE':
        return (type: AlertType) => type.isActive
      case 'REACTIVATE':
        return (type: AlertType) => !type.isActive
      default:
        return (_type: AlertType) => true
    }
  } else if (journey.referenceDataType === 'ALERT_CODE') {
    switch (journey.changeType) {
      case 'EDIT_DESCRIPTION':
        return (type: AlertType) => type.alertCodes.length > 0
      case 'DEACTIVATE':
        return (type: AlertType) => type.alertCodes.some(code => code.isActive)
      case 'REACTIVATE':
        return (type: AlertType) => type.alertCodes.some(code => !code.isActive)
      default:
        return (_type: AlertType) => true
    }
  }
  return (_type: AlertType) => true
}
