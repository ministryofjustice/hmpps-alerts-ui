import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../authentication/authorisedRoles'

context('test /update-reference-data screen', () => {
  const uuid = uuidV4()

  const getContinueButton = () => cy.findByRole('button', { name: /Continue/ })
  const getRadio1 = () => cy.findByRole('radio', { name: /Alert$/ })
  const getRadio2 = () => cy.findByRole('radio', { name: /Alert type$/ })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubGetAlertTypes')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
  })

  it('should try out all cases', () => {
    navigateToTestPage()
    cy.url().should('to.match', /\/update-reference-data$/)
    cy.checkAxeAccessibility()
    validatePageContents()
    validateErrorMessages()
    proceedToNextPage()
    validateAnswersArePersisted()
  })

  const navigateToTestPage = () => {
    cy.signIn()
    cy.visit(`/${uuid}/update-reference-data`, { failOnStatusCode: false })
  }

  const validatePageContents = () => {
    cy.title().should('match', /What do you want to update\? - Maintain alerts reference data - DPS/)
    cy.findByRole('heading', {
      name: /What do you want to update\?/,
    }).should('be.visible')
    getContinueButton().should('be.visible')
    getRadio1().should('exist')
    getRadio2().should('exist')
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /\/$/)
  }

  const validateErrorMessages = () => {
    getContinueButton().click()
    cy.findByRole('link', { name: /Select the type of reference data you want to update$/i })
      .should('be.visible')
      .click()
    getRadio1().should('be.focused')
  }

  const proceedToNextPage = () => {
    getRadio1().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/update-reference-data\/select-change$/)
  }

  const validateAnswersArePersisted = () => {
    cy.go('back')
    cy.reload()
    getRadio1().should('be.checked')
  }
})
