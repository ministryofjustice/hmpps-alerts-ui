import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /update-reference-data/add-alert-code screen', () => {
  const uuid = uuidV4()

  const getContinueButton = () => cy.findByRole('button', { name: /Continue/ })
  const getDescriptionInput = () => cy.findByRole('textbox', { name: /Enter a new alert description$/ })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
  })

  it('should try out all cases', () => {
    navigateToTestPage()
    cy.url().should('to.match', /\/edit-alert-code$/)
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
        alertCode: {
          code: 'AA',
          description: 'Original Name',
          isActive: true,
        },
      },
    })
    cy.visit(`/${uuid}/update-reference-data/edit-alert-code`, { failOnStatusCode: false })
  }

  const validatePageContents = () => {
    cy.title().should('match', /Edit alert description - Maintain alerts reference data - DPS/)
    cy.findByRole('heading', {
      name: /Edit alert description/,
    }).should('be.visible')
    getContinueButton().should('be.visible')
    getDescriptionInput().should('be.visible').and('have.value', 'Original Name')
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /select-alert-code$/)
  }

  const validateErrorMessages = () => {
    getDescriptionInput().clear()
    getContinueButton().click()

    cy.findByRole('link', { name: /An alert description must be between 1 and 40 characters$/ })
      .should('be.visible')
      .click()
    getDescriptionInput().should('be.focused')
  }

  const proceedToNextPage = () => {
    getDescriptionInput().clear().type('New Name', { delay: 0 })
    getContinueButton().click()
    cy.url().should('to.match', /\/update-reference-data\/check-answers$/)
  }

  const validateAnswersArePersisted = () => {
    cy.go('back')
    cy.reload()
    getDescriptionInput().should('have.value', 'New Name')
  }
})
