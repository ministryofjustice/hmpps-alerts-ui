import Page, { PageElement } from './page'

export default class AlertCodeDeactivationConfirmationPage extends Page {
  constructor(alertCode: string) {
    super(`Are you sure you want to deactivate alert code ${alertCode}?`)
  }

  public selectCode(): PageElement {
    return cy.get('#alertCode')
  }

  public continue(): PageElement {
    return cy.get('[data-qa=alert-code]')
  }
}
