import Page, { PageElement } from './page'

export default class UpdateAlertCodeDescriptionConfirmationPage extends Page {
  constructor(alertTypeCode: string, alertTypeDescription: string) {
    super(
      `Are you sure you want to change the description for alert code "${alertTypeCode}" to "${alertTypeDescription}"?`,
    )
  }

  public selectYes(): PageElement {
    return cy.get('#confirmation')
  }

  public continue(): PageElement {
    return cy.get('[data-qa=confirmation]')
  }
}
