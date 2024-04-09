import Page, { PageElement } from './page'

export default class AddAnAlertCode extends Page {
  constructor() {
    super('Add alert code details')
  }

  public codeInput(): PageElement {
    return cy.get('#alertCode')
  }

  public descriptionInput(): PageElement {
    return cy.get('#alertDescription')
  }

  public continue(): PageElement {
    return cy.get('[data-qa=alert-code]')
  }
}
