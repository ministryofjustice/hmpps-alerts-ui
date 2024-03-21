import Page, { PageElement } from './page'

export default class AddAnAlertTypeConfirmationPage extends Page {
  constructor() {
    super('Check your answers before creating your alert type')
  }

  public code(): PageElement {
    return cy.get('[data-qa=code]')
  }

  public description(): PageElement {
    return cy.get('[data-qa=description]')
  }

  public continue(): PageElement {
    return cy.get('[data-qa=alert-type-code-save]')
  }
}
