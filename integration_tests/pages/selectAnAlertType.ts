import Page, { PageElement } from './page'

export default class SelectAnAlertType extends Page {
  constructor() {
    super('Select an alert type')
  }

  public selectCode(): PageElement {
    return cy.get('[data-module=govuk-radios]').get('.govuk-radios__item')
  }

  public continue(): PageElement {
    return cy.get('[data-qa=alert-type-code]')
  }
}
