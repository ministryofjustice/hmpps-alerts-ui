import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /update-reference-data/add-alert-code screen', () => {
  const uuid = uuidV4()

  const getContinueButton = () => cy.findByRole('button', { name: /Continue/ })
  const getCodeInput = () => cy.findByRole('textbox', { name: /Enter an alert code$/ })
  const getDescriptionInput = () => cy.findByRole('textbox', { name: /Enter a description of the alert$/ })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubGetAlertTypes')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
  })

  it('should try out all cases', () => {
    navigateToTestPage()
    cy.url().should('to.match', /\/add-alert-code$/)
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
      updateRefData: {
        referenceDataType: 'ALERT_CODE',
        changeType: 'ADD_NEW',
        alertType: {
          code: 'AB',
          description: 'Type Name',
          isActive: true,
        },
      },
    })
    cy.visit(`/${uuid}/update-reference-data/add-alert-code`, { failOnStatusCode: false })
  }

  const validatePageContents = () => {
    cy.title().should('match', /Add new alert details - Maintain alerts reference data - DPS/)
    cy.findByRole('heading', {
      name: /Add new alert details/,
    }).should('be.visible')
    getContinueButton().should('be.visible')
    getCodeInput().should('be.visible').and('have.value', '')
    getDescriptionInput().should('be.visible').and('have.value', '')
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /select-alert-type$/)
  }

  const validateErrorMessages = () => {
    getContinueButton().click()

    cy.findByRole('link', {
      name: /An alert code must be an uppercase series of letters between 1-12 characters long$/,
    })
      .should('be.visible')
      .click()
    getCodeInput().should('be.focused')

    cy.findByRole('link', { name: /An alert description must be between 1 and 40 characters$/ })
      .should('be.visible')
      .click()
    getDescriptionInput().should('be.focused')

    getCodeInput().type('AA', { delay: 0 })
    getContinueButton().click()

    cy.findByRole('link', {
      name: 'Alert code ‘AA’ already exists',
    })
      .should('be.visible')
      .click()
    getCodeInput().should('be.focused')
  }

  const proceedToNextPage = () => {
    getCodeInput().type('ABC', { delay: 0 })
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
