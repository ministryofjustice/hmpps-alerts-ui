import Page, { PageElement } from './page'

export default class UpdateAlertTypeDescriptionConfirmationPage extends Page {
  constructor(alertTypeCode: string, alertTypeDescription: string) {
    super(
      `Are you sure you want to change the description for alert type code "${alertTypeCode}" to "${alertTypeDescription}"?`,
    )
  }

  public selectYes(): PageElement {
    return cy.get('#confirmation')
  }

  public continue(): PageElement {
    return cy.get('[data-qa=confirmation]')
  }
}
