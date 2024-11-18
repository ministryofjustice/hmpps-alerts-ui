import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /bulk-alerts/check-answers', () => {
  const uuid = uuidV4()

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubGetAlertTypes')
    cy.task('stubPlanBulkAlerts')
    cy.task('stubCreateBulkAlerts')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS],
    })
  })

  it('should be able to change answers and proceed to confirmation', () => {
    navigateToTestPage()
    cy.url().should('to.match', /\/check-answers$/)

    cy.title().should('equal', 'Check your answers before uploading alerts in bulk - Upload alerts in bulk - DPS')
    cy.findByRole('heading', { name: /Check your answers before uploading alerts in bulk/ }).should('be.visible')
    cy.findByText(
      '1 new ‘OCG Nominal’ alert will be created, 2 existing ‘OCG Nominal’ alerts will be made inactive, and 3 existing ‘OCG Nominal’ alerts will remain active.',
    ).should('be.visible')

    cy.contains('dt', 'Alert').next().should('include.text', 'OCG Nominal')
    cy.contains('dt', 'Reason for alert')
      .next()
      .should(
        'include.text',
        '** Offenders must not be made aware of the OCG flag status.  Do not Share with offender. **',
      )
    cy.contains('dt', 'Number of prisoners on list').next().should('include.text', '2')
    cy.contains('dt', 'Upload logic')
      .next()
      .should('include.text', 'Deactivate ‘OCG Nominal’ alerts for anyone not on the list')

    cy.findByRole('link', { name: /Change the alert to be created/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /bulk-alerts#alertCode$/)

    cy.findByRole('link', { name: /Change the selected prisoners/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /review-prisoners$/)

    cy.findByRole('link', { name: /Change the upload logic/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /select-upload-logic#cleanupMode$/)

    // No change link for OCG Nominal alert description
    cy.findByRole('link', { name: /Change the reason for alert/i }).should('not.exist')

    // test description and change link for non-OCG Nominal alert
    injectJourneyDataAndReload(uuid, {
      bulkAlert: {
        alertType: {
          code: 'DB',
          description: 'DB Description',
        },
        alertCode: {
          code: 'AA',
          description: 'AA description',
        },
        description: 'reason text',
        useCsvUpload: false,
        prisonersSelected: [
          {
            firstName: 'TestName',
            lastName: 'User',
            prisonerNumber: 'A1111AA',
            cellLocation: 'A-1-1',
          },
          {
            firstName: 'John',
            lastName: 'Smith',
            prisonerNumber: 'B1111BB',
            cellLocation: 'A-1-1',
          },
        ],
        cleanupMode: 'EXPIRE_FOR_PRISON_NUMBERS_NOT_SPECIFIED',
      },
    })

    cy.contains('dt', 'Reason for alert').next().should('include.text', 'reason text')
    cy.findByRole('link', { name: /Change the reason for alert/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /enter-alert-reason#description$/)

    continueToConfirmation()
  })

  const navigateToTestPage = () => {
    cy.signIn()
    cy.visit(`/${uuid}/bulk-alerts`, { failOnStatusCode: false })
    injectJourneyDataAndReload(uuid, {
      bulkAlert: {
        alertType: {
          code: 'DB',
          description: 'DB Description',
        },
        alertCode: {
          code: 'DOCGM',
          description: 'OCG Nominal',
        },
        useCsvUpload: false,
        prisonersSelected: [
          {
            firstName: 'TestName',
            lastName: 'User',
            prisonerNumber: 'A1111AA',
            cellLocation: 'A-1-1',
          },
          {
            firstName: 'John',
            lastName: 'Smith',
            prisonerNumber: 'B1111BB',
            cellLocation: 'A-1-1',
          },
        ],
        cleanupMode: 'EXPIRE_FOR_PRISON_NUMBERS_NOT_SPECIFIED',
      },
    })
    cy.visit(`/${uuid}/bulk-alerts/check-answers`)
  }

  const continueToConfirmation = () => {
    cy.findByRole('button', { name: /Confirm and upload alerts/i }).click()
    cy.url().should('to.match', /\/confirmation(#[A-z]+)?$/)
  }
})
