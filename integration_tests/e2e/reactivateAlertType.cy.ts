import AuthorisedRoles from '../../server/authentication/authorisedRoles'

context('Reactivate an alert type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER] })
    cy.task('stubGetDeactivatedAlertTypes')
    cy.task('stubReactivateAlertType')
  })

  it('Reactivate a reactivated alert type - happy path', () => {
    cy.signIn()

    cy.clickLink('Update alerts and alert types')

    cy.clickRadio(/Alert type$/)
    cy.clickContinueButton()

    cy.clickRadio('Reactivate alert type')
    cy.clickContinueButton()

    cy.clickRadio('AA (A description) Deactivated')
    cy.clickContinueButton()

    // can change answers
    cy.findByRole('heading', { name: 'Check your changes' }).should('be.visible')
    cy.contains('dt', 'Alert type to be reactivated').next().should('include.text', 'AA (A description)')

    cy.clickLink('Change the alert type to be reactivated')
    cy.clickRadio('DB (A description) Deactivated')
    cy.clickContinueButton()
    cy.contains('dt', 'Alert type to be reactivated').next().should('include.text', 'DB (A description)')

    // confirm and save
    cy.clickContinueButton(/Confirm and save/)

    cy.findByText('Alert type reactivated').should('be.visible')
    cy.findByText('You have reactivated the DB (A description) alert type.').should('be.visible')

    cy.verifyLastAPICall(
      {
        method: 'POST',
        urlPath: `/alerts-api/alert-types/DB/reactivate`,
      },
      undefined,
    )
  })
})
