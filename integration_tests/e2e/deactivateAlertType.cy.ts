import AuthorisedRoles from '../../server/authentication/authorisedRoles'

context('Deactivate an alert type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER] })
    cy.task('stubGetAlertTypes')
    cy.task('stubDeactivateAlertType')
  })

  it('Deactivate an existing alert type - happy path', () => {
    cy.signIn()
    cy.clickLink('Update alerts and alert types')

    cy.clickRadio(/Alert type$/)
    cy.clickContinueButton()

    cy.clickRadio('Deactivate alert type')
    cy.clickContinueButton()

    cy.clickRadio('DB (DB description)')
    cy.clickContinueButton()

    // confirm and save
    cy.clickRadio('Yes')
    cy.clickContinueButton(/Confirm and save/)

    cy.findByText('Alert type deactivated').should('be.visible')
    cy.findByText('You have deactivated the DB (DB description) alert type.').should('be.visible')

    cy.verifyLastAPICall(
      {
        method: 'POST',
        urlPath: `/alerts-api/alert-types/DB/deactivate`,
      },
      undefined,
    )
  })
})
