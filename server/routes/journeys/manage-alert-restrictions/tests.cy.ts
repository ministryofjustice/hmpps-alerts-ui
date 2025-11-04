import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../authentication/authorisedRoles'
import Chainable = Cypress.Chainable

context('Manage alert restrictions page', () => {
  const uuid = uuidV4()

  const getRestrictAlertRadio = () => cy.findByRole('radio', { name: /Restrict alert$/ })
  const getRemoveRestrictionRadio = () => cy.findByRole('radio', { name: /Remove alert restriction$/ })
  const getAddPURadio = () => cy.findByRole('radio', { name: /Add privileged user$/ })
  const getRemovePURadio = () => cy.findByRole('radio', { name: /Remove privileged user$/ })
  const getContinueButton = () => cy.findByRole('button', { name: /Continue/ })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubGetAlertTypes')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_DPS_APPLICATION_DEVELOPER],
    })
  })

  it('should require the DPS_APPLICATION_DEVELOPER role to view the page', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
    navigateToTestPage()

    cy.findByRole('heading', { name: /Authorisation Error/ }).should('be.visible')
  })

  it('should have the correct content', () => {
    navigateToTestPage()
    cy.url().should('to.match', /\/manage-alert-restrictions$/)
    cy.checkAxeAccessibility()
    validatePageContents()
  })

  it('should validate radio input', () => {
    navigateToTestPage()
    getContinueButton().click()
    cy.findByRole('link', { name: /Select the change you want to make$/i })
      .should('be.visible')
      .click()
    getRestrictAlertRadio().should('be.focused')
  })

  it('should navigate to correct page based on radio input and persist journey data', () => {
    navigateToTestPage()
    checkNextPage(getRestrictAlertRadio)
    checkNextPage(getRemoveRestrictionRadio)
    checkNextPage(getAddPURadio)
    checkNextPage(getRemovePURadio)
  })

  const validatePageContents = () => {
    cy.title().should('match', /Select the change you want to make - Manage alert restrictions - DPS/)
    cy.findByRole('heading', {
      name: /Select the change you want to make/,
    }).should('be.visible')
    getContinueButton().should('be.visible')
    getRestrictAlertRadio().should('exist')
    getRemoveRestrictionRadio().should('exist')
    getAddPURadio().should('exist')
    getRemovePURadio().should('exist')
    cy.findByRole('link', { name: /^Manage prisoner alerts$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /\/$/)
  }

  const navigateToTestPage = () => {
    cy.signIn()
    cy.visit(`/${uuid}/manage-alert-restrictions`, { failOnStatusCode: false })
  }

  const checkNextPage = (radio: () => Chainable<JQuery>) => {
    radio().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/manage-alert-restrictions\/select-alert-type$/)
    cy.go('back')
    cy.reload()
    radio().should('be.checked')
  }
})
