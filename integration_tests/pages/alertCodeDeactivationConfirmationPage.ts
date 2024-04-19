import Page, { PageElement } from './page'

export default class AlertCodeDeactivationConfirmationPage extends Page {
  constructor(alertCode: string) {
    super(`Are you sure you want to deactivate alert code ${alertCode}?`)
  }

  public selectYes(): PageElement {
    return cy.get('#confirmation')
  }

  public continue(): PageElement {
    return cy.get('[data-qa=confirmation]')
  }
}
