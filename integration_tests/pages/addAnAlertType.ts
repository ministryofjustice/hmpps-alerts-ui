import Page, { PageElement } from './page'

export default class AddAnAlertType extends Page {
  constructor() {
    super('Add alert type details')
  }

  public codeInput(): PageElement {
    return cy.get('#alertTypeCode')
  }

  public descriptionInput(): PageElement {
    return cy.get('#alertTypeDescription')
  }

  public continue(): PageElement {
    return cy.get('[data-qa=alert-type-code]')
  }
}
