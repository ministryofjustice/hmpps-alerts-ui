import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /bulk-alerts/confirmation', () => {
  const uuid = uuidV4()

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubGetAlertTypes')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS],
    })
  })

  it('should try out all cases', () => {
    navigateToTestPage()
    cy.url().should('to.match', /\/confirmation$/)
    cy.title().should('equal', 'Alerts uploaded in bulk successfully - DPS')

    validatePageContents()
  })

  const validatePageContents = () => {
    cy.findByText('Alerts uploaded in bulk successfully').should('be.visible')

    cy.findByText('1 new ‘OCG Nominal’ alert was created.').should('be.visible')
    cy.findByText('0 existing ‘OCG Nominal’ alerts were made inactive.').should('be.visible')
    cy.findByText('2 existing ‘OCG Nominal’ alerts remain active.').should('be.visible')

    cy.findByRole('heading', { name: /What you can do next/ }).should('be.visible')

    cy.findByRole('link', { name: 'Upload more alerts in bulk' })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /\/bulk-alerts$/)
    cy.findByRole('link', { name: 'Update alerts reference data' })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('equal', '/')
  }

  const navigateToTestPage = () => {
    cy.signIn()
    cy.visit(`/${uuid}/bulk-alerts`, { failOnStatusCode: false })
    injectJourneyDataAndReload(uuid, {
      bulkAlert: {
        alertCode: {
          code: 'DOCGM',
          description: 'OCG Nominal',
        },
        result: {
          existingAlerts: 1,
          created: 1,
          updated: 1,
          expired: 0,
        },
      },
    })
    cy.visit(`/${uuid}/bulk-alerts/confirmation`)
  }
})
