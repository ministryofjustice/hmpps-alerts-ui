import { UpdateReferenceDataJourney } from '../../../../@types/express'
import { AlertCode } from '../../../../@types/alerts/alertsApiTypes'

export const getAlertCodeFilter = (journey: UpdateReferenceDataJourney): ((code: AlertCode) => boolean) => {
  switch (journey.changeType) {
    case 'DEACTIVATE':
      return (code: AlertCode) => code.isActive
    case 'REACTIVATE':
      return (code: AlertCode) => !code.isActive
    default:
      return (_code: AlertCode) => true
  }
}

export default { getAlertCodeFilter }
