import Page from './page'

export default class UpdateAlertTypeDescriptionSuccessPage extends Page {
  constructor(alertTypeCode: string, alertTypeDescription: string) {
    super(`Alert type code: ${alertTypeCode} is updated with new description: ${alertTypeDescription}.`)
  }
}
