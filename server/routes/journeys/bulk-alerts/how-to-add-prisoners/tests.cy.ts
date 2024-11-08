import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /bulk-alerts/how-to-add-prisoners screen', () => {
  const uuid = uuidV4()

  const getContinueButton = () => cy.findByRole('button', { name: /Continue/ })
  const getRadio1 = () => cy.findByRole('radio', { name: /Search for them one by one/ })
  const getRadio2 = () => cy.findByRole('radio', { name: /Add a group of people using a CSV file/ })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubGetAlertTypes')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS],
    })
  })

  it('should try out all cases', () => {
    // test OCG Nominal path
    navigateToTestPage()
    cy.url().should('to.match', /\/bulk-alerts\/how-to-add-prisoners$/)
    validatePageContents()
    validateErrorMessages()
    proceedToNextPage()
    validateAnswersArePersisted()

    // test non-OCG Nominal path
    injectJourneyDataAndReload(uuid, {
      bulkAlert: {
        alertCode: {
          code: 'CSIP',
        },
      },
    })
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /enter-alert-reason$/)
    getRadio2().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/bulk-alerts\/upload-prisoner-list$/)
  })

  const navigateToTestPage = () => {
    cy.signIn()
    cy.visit(`/${uuid}/bulk-alerts`, { failOnStatusCode: false })
    injectJourneyDataAndReload(uuid, {
      bulkAlert: {
        alertCode: {
          code: 'DOCGM',
        },
      },
    })
    cy.visit(`/${uuid}/bulk-alerts/how-to-add-prisoners`)
  }

  const validatePageContents = () => {
    cy.title().should(
      'equal',
      'How do you want to select the individuals that should have this alert applied to them? - Upload alerts in bulk - DPS',
    )
    cy.findByRole('heading', {
      name: /How do you want to select the individuals that should have this alert applied to them?/i,
    }).should('be.visible')
    getContinueButton().should('be.visible')
    getRadio1().should('exist')
    getRadio2().should('exist')
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /bulk-alerts$/)
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
    cy.url().should('to.match', /\/bulk-alerts\/select-prisoner$/)
  }

  const validateAnswersArePersisted = () => {
    cy.go('back')
    cy.reload()
    getRadio1().should('be.checked')
  }
})
