import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /update-reference-data/add-alert-type screen', () => {
  const uuid = uuidV4()

  const getContinueButton = () => cy.findByRole('button', { name: /Continue/ })
  const getCodeInput = () => cy.findByRole('textbox', { name: /Enter an alert type code$/ })
  const getDescriptionInput = () => cy.findByRole('textbox', { name: /Enter a description of the alert type$/ })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubGetAlertTypes')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
  })

  it('should try out all cases', () => {
    navigateToTestPage()
    cy.url().should('to.match', /\/add-alert-type$/)
    cy.checkAxeAccessibility()
    validatePageContents()
    validateErrorMessages()
    proceedToNextPage()
    validateAnswersArePersisted()
  })

  const navigateToTestPage = () => {
    cy.signIn()
    cy.visit(`/${uuid}/update-reference-data`, { failOnStatusCode: false })
    injectJourneyDataAndReload(uuid, {
      updateRefData: { referenceDataType: 'ALERT_TYPE', changeType: 'ADD_NEW' },
    })
    cy.visit(`/${uuid}/update-reference-data/add-alert-type`, { failOnStatusCode: false })
  }

  const validatePageContents = () => {
    cy.title().should('match', /Add new alert type details - Maintain alerts reference data - DPS/)
    cy.findByRole('heading', {
      name: /Add new alert type details/,
    }).should('be.visible')
    getContinueButton().should('be.visible')
    getCodeInput().should('be.visible').and('have.value', '')
    getDescriptionInput().should('be.visible').and('have.value', '')
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /select-change$/)
  }

  const validateErrorMessages = () => {
    getContinueButton().click()

    cy.findByRole('link', {
      name: /An alert type code must be an uppercase series of letters between 1-12 characters long$/,
    })
      .should('be.visible')
      .click()
    getCodeInput().should('be.focused')

    cy.findByRole('link', { name: /An alert type description must be between 1 and 40 characters$/ })
      .should('be.visible')
      .click()
    getDescriptionInput().should('be.focused')

    getCodeInput().type('AA', { delay: 0 })
    getContinueButton().click()

    cy.findByRole('link', {
      name: 'Alert type code ‘AA’ already exists',
    })
      .should('be.visible')
      .click()
    getCodeInput().should('be.focused')
  }

  const proceedToNextPage = () => {
    getCodeInput().clear().type('ABC', { delay: 0 })
    getDescriptionInput().type('Some text', { delay: 0 })
    getContinueButton().click()
    cy.url().should('to.match', /\/update-reference-data\/check-answers$/)
  }

  const validateAnswersArePersisted = () => {
    cy.go('back')
    cy.reload()
    getCodeInput().should('have.value', 'ABC')
    getDescriptionInput().should('have.value', 'Some text')
  }
})
