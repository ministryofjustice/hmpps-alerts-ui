import Page, { PageElement } from './page'

export default class EnterDescriptionForUpdateAlertCode extends Page {
  constructor() {
    super('Enter a new description for alert code')
  }

  public descriptionField(): PageElement {
    return cy.get('#descriptionEntry')
  }

  public continue(): PageElement {
    return cy.get('[data-qa=alert-code-description]')
  }
}
