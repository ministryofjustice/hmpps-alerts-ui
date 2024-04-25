import Page from './page'

export default class UpdateAlertTypeDescriptionSuccessPage extends Page {
  constructor(alertTypeCode: string, alertTypeDescription: string) {
    super(
      `Alert type code: <strong>${alertTypeCode}</strong> is updated with new description: <strong>${alertTypeDescription}</strong>.`,
    )
  }
}
