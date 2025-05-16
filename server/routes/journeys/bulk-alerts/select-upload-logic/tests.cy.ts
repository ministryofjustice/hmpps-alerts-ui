import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /bulk-alerts/select-upload-logic screen', () => {
  const uuid = uuidV4()

  const getContinueButton = () => cy.findByRole('button', { name: /Continue/ })
  const getRadio1 = () =>
    cy.findByRole('radio', {
      name: /Add new alerts from the list without deactivating any existing ‘OCG Nominal’ alerts/,
    })
  const getRadio2 = () => cy.findByRole('radio', { name: /Deactivate ‘OCG Nominal’ alerts for anyone not on the list/ })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubGetAlertTypes')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS],
    })
  })

  it('should try out all cases', () => {
    navigateToTestPage()
    cy.url().should('to.match', /\/bulk-alerts\/select-upload-logic$/)
    cy.checkAxeAccessibility()
    validatePageContents()
    validateErrorMessages()
    proceedToNextPage()
    validateAnswersArePersisted()
  })

  const navigateToTestPage = () => {
    cy.signIn()
    cy.visit(`/${uuid}/bulk-alerts`, { failOnStatusCode: false })
    injectJourneyDataAndReload(uuid, {
      bulkAlert: {
        alertCode: {
          code: 'DOCGM',
          description: 'OCG Nominal',
        },
      },
    })
    cy.visit(`/${uuid}/bulk-alerts/select-upload-logic`)
  }

  const validatePageContents = () => {
    cy.title().should(
      'match',
      /What do you want to happen when the bulk alert upload for ‘OCG Nominal’ is applied\? - Upload alerts in bulk - DPS/,
    )
    cy.findByRole('heading', {
      name: /What do you want to happen when the bulk alert upload for ‘OCG Nominal’ is applied\?/i,
    }).should('be.visible')
    getContinueButton().should('be.visible')
    getRadio1().should('exist')
    getRadio2().should('exist')
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /review-prisoners$/)
  }

  const validateErrorMessages = () => {
    getContinueButton().click()
    cy.findByRole('link', { name: /You must select one option$/i })
      .should('be.visible')
      .click()
    getRadio1().should('be.focused')
  }

  const proceedToNextPage = () => {
    getRadio1().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/bulk-alerts\/check-answers$/)
  }

  const validateAnswersArePersisted = () => {
    cy.go('back')
    cy.reload()
    getRadio1().should('be.checked')
  }
})
