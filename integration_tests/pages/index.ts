import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('Alerts')
  }

  public static goTo(): IndexPage {
    cy.visit('/')
    return new IndexPage()
  }

  createAlertTypeLink = (): PageElement => cy.get('[data-qa=create-alert-type]')

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerPhaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')
}
