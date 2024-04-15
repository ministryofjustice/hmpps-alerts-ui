import Page, { PageElement } from './page'

export default class SelectAnAlertTypeForAlertCodeDeactivation extends Page {
  constructor() {
    super('Select an alert type')
  }

  public selectCode(): PageElement {
    return cy.get('#alertType')
  }

  public continue(): PageElement {
    return cy.get('[data-qa=alert-type-code]')
  }
}
