import Page, { PageElement } from './page'

export default class EnterDescriptionForUpdateAlertType extends Page {
  constructor() {
    super('Enter a new description for alert type code')
  }

  public descriptionField(): PageElement {
    return cy.get('#descriptionEntry')
  }

  public continue(): PageElement {
    return cy.get('[data-qa=alert-type-description]')
  }
}
