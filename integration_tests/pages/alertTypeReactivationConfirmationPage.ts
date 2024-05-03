import Page, { PageElement } from './page'

export default class AlertTypeReactivationConfirmationPage extends Page {
  constructor(alertCode: string) {
    super(`Are you sure you want to reactivate alert type ${alertCode}?`)
  }

  public selectYes(): PageElement {
    return cy.get('#confirmation')
  }

  public continue(): PageElement {
    return cy.get('[data-qa=confirmation]')
  }
}
