import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /manage-alert-restrictions/select-user screen', () => {
  const uuid = uuidV4()

  const getContinueButton = () => cy.findByRole('button', { name: /Continue/ })
  const getUsernameInput = () => cy.findByRole('textbox', { name: /Enter a username$/ })

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

  it('should try out all cases', () => {
    navigateToTestPage()
    cy.url().should('to.match', /\/manage-alert-restrictions\/select-user$/)
    cy.checkAxeAccessibility()
    validatePageContents()
    validateErrorMessages()
    proceedToNextPage()
    validateAnswersArePersisted()
  })

  const navigateToTestPage = () => {
    cy.signIn()
    cy.visit(`/${uuid}/manage-alert-restrictions`, { failOnStatusCode: false })
    injectJourneyDataAndReload(uuid, {
      restrictAlert: {
        changeType: 'ADD_PRIVILEGED_USER',
        alertType: {
          code: 'XX',
          description: 'Restricted Type',
          isActive: true,
        },
      },
    })
    cy.visit(`/${uuid}/manage-alert-restrictions/select-user`, { failOnStatusCode: false })
  }

  const validatePageContents = () => {
    cy.title().should('match', /Select a user - Manage alert restrictions - DPS/)
    cy.findByRole('heading', {
      name: /Select a user/,
    }).should('be.visible')
    getContinueButton().should('be.visible')
    getUsernameInput().should('be.visible').and('have.value', '')
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /select-alert-code$/)
  }

  const validateErrorMessages = () => {
    getContinueButton().click()

    cy.findByRole('link', {
      name: /Enter a username$/,
    })
      .should('be.visible')
      .click()
    getUsernameInput().should('be.focused')
  }

  const proceedToNextPage = () => {
    getUsernameInput().type('ABC', { delay: 0 })
    getUsernameInput().clear().type('ABC', { delay: 0 })
    getContinueButton().click()
    cy.url().should('to.match', /\/manage-alert-restrictions\/check-answers$/)
  }

  const validateAnswersArePersisted = () => {
    cy.go('back')
    cy.reload()
    getUsernameInput().should('have.value', 'ABC')
  }
})
