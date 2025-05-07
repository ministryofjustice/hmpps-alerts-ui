import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'
import { UpdateReferenceDataJourney } from '../../../../@types/express'

context('test /bulk-alerts/check-answers', () => {
  const uuid = uuidV4()

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubCreateAlertType')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
  })

  it('should check answers for Create Alert Type', () => {
    navigateToTestPage({
      referenceDataType: 'ALERT_TYPE',
      changeType: 'ADD_NEW',
      code: 'ABC',
      description: 'Some text',
    })
    cy.url().should('to.match', /\/check-answers$/)

    cy.title().should('equal', 'Check your changes - Maintain alerts reference data - DPS')
    cy.findByRole('heading', { name: /Check your changes/ }).should('be.visible')

    cy.contains('dt', 'New alert type').next().should('include.text', 'ABC')
    cy.contains('dt', 'New alert description').next().should('include.text', 'Some text')

    cy.findByRole('link', { name: /Change the alert type code/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /add-alert-type#code$/)

    cy.findByRole('link', { name: /Change the alert type description/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /add-alert-type#description$/)

    continueToConfirmation()
  })

  const navigateToTestPage = (journeyData: UpdateReferenceDataJourney) => {
    cy.signIn()
    cy.visit(`/${uuid}/update-reference-data`, { failOnStatusCode: false })
    injectJourneyDataAndReload(uuid, {
      updateRefData: journeyData,
    })
    cy.visit(`/${uuid}/update-reference-data/check-answers`)
  }

  const continueToConfirmation = () => {
    cy.findByRole('button', { name: /Confirm and save/i }).click()
    cy.url().should('to.match', /\/confirmation(#[A-z]+)?$/)
  }
})
