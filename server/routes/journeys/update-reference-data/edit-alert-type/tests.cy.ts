import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /update-reference-data/add-alert-type screen', () => {
  const uuid = uuidV4()

  const getContinueButton = () => cy.findByRole('button', { name: /Continue/ })
  const getDescriptionInput = () => cy.findByRole('textbox', { name: /Enter a new alert type description$/ })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
  })

  it('should try out all cases', () => {
    navigateToTestPage()
    cy.url().should('to.match', /\/edit-alert-type$/)
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
        referenceDataType: 'ALERT_TYPE',
        changeType: 'EDIT_DESCRIPTION',
        alertType: {
          code: 'AB',
          description: 'Original Name',
          isActive: true,
        },
      },
    })
    cy.visit(`/${uuid}/update-reference-data/edit-alert-type`, { failOnStatusCode: false })
  }

  const validatePageContents = () => {
    cy.title().should('match', /Edit alert type description - Maintain alerts reference data - DPS/)
    cy.findByRole('heading', {
      name: /Edit alert type description/,
    }).should('be.visible')
    getContinueButton().should('be.visible')
    getDescriptionInput().should('be.visible').and('have.value', 'Original Name')
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /select-alert-type$/)
  }

  const validateErrorMessages = () => {
    getDescriptionInput().clear()
    getContinueButton().click()

    cy.findByRole('link', { name: /An alert type description must be between 1 and 40 characters$/ })
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
