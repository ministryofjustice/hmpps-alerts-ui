import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /bulk-alerts/cancellation-check', () => {
  const uuid = uuidV4()

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS],
    })
  })

  it('should render the view and proceed to homepage', () => {
    navigateToTestPage()
    cy.url().should('to.match', /\/cancellation-check$/)
    cy.checkAxeAccessibility()

    cy.title().should('equal', 'Are you sure you want to cancel this bulk alerts upload? - Upload alerts in bulk - DPS')
    cy.findByRole('heading', { name: /Are you sure you want to cancel this bulk alerts upload\?/ }).should('be.visible')
    cy.findByText(
      'If you choose not to complete this bulk alerts upload, you will lose the information you have entered.',
    ).should('be.visible')
    cy.findByRole('button', { name: 'No, return to check answers' })
      .should('be.visible')
      .and('have.attr', 'href')
      .should('match', /check-answers/)

    cy.findByRole('button', { name: 'Yes, cancel this upload' }).click()
    cy.findByRole('heading', { name: 'Manage prisoner alerts' }).should('be.visible')
  })

  const navigateToTestPage = () => {
    cy.signIn()
    cy.visit(`/${uuid}/bulk-alerts`, { failOnStatusCode: false })
    injectJourneyDataAndReload(uuid, {
      bulkAlert: {
        planId: 'plan-uuid',
        alertType: {
          code: 'DB',
          description: 'DB Description',
        },
        alertCode: {
          code: 'DOCGM',
          description: 'OCG Nominal',
        },
        useCsvUpload: false,
        prisonersSelectedCount: 2,
        cleanupMode: 'EXPIRE_FOR_PRISON_NUMBERS_NOT_SPECIFIED',
      },
    })
    cy.visit(`/${uuid}/bulk-alerts/cancellation-check`)
  }
})
