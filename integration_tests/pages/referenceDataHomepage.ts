import Page, { PageElement } from './page'

export default class ReferenceDataHomepage extends Page {
  constructor() {
    super('Alerts')
  }

  public static goTo(): ReferenceDataHomepage {
    cy.visit('/manage-reference-data')
    return new ReferenceDataHomepage()
  }

  createAlertTypeLink = (): PageElement => cy.get('[data-qa=create-alert-type]')

  updateAlertTypeLink = (): PageElement => cy.get('[data-qa=update-alert-type]')

  createAlertCodeLink = (): PageElement => cy.get('[data-qa=create-alert-code]')

  updateAlertCodeLink = (): PageElement => cy.get('[data-qa=update-alert-code]')

  deactivateAlertCodeLink = (): PageElement => cy.get('[data-qa=deactivate-alert-code]')

  reactivateAlertCodeLink = (): PageElement => cy.get('[data-qa=reactivate-alert-code]')

  deactivateAlertTypeLink = (): PageElement => cy.get('[data-qa=deactivate-alert-type]')

  reactivateAlertTypeLink = (): PageElement => cy.get('[data-qa=reactivate-alert-type]')

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerPhaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')
}
