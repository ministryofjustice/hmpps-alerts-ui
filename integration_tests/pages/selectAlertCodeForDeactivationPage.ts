import Page, { PageElement } from './page'

export default class SelectAlertCodeForDeactivationPage extends Page {
  constructor() {
    super('Select an alert code')
  }

  public selectCode(): PageElement {
    return cy.get('#alertCode')
  }

  public continue(): PageElement {
    return cy.get('[data-qa=alert-code]')
  }
}
