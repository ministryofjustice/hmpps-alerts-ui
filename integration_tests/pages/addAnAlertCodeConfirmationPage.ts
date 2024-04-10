import Page, { PageElement } from './page'

export default class AddAnAlertCodeConfirmationPage extends Page {
  constructor() {
    super('Check your answers before creating your alert code')
  }

  public code(): PageElement {
    return cy.get('[data-qa=code]')
  }

  public description(): PageElement {
    return cy.get('[data-qa=description]')
  }

  public parent(): PageElement {
    return cy.get('[data-qa=parent]')
  }

  public continue(): PageElement {
    return cy.get('[data-qa=alert-code-save]')
  }
}
