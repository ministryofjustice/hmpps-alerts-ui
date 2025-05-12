import AuthorisedRoles from '../../server/authentication/authorisedRoles'

context('Deactivate an alert code', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER] })
    cy.task('stubGetAlertTypes')
    cy.task('stubDeactivateAlertCode')
  })

  it('Deactivate an existing alert code - happy path', () => {
    cy.signIn()

    cy.clickLink('Update alerts and alert types')

    cy.clickRadio(/Alert$/)
    cy.clickContinueButton()

    cy.clickRadio('Deactivate alert')
    cy.clickContinueButton()

    cy.clickRadio('DB (DB description)')
    cy.clickContinueButton()

    cy.clickRadio('AA (AA description)')
    cy.clickContinueButton()

    // confirm and save
    cy.clickRadio('Yes')
    cy.clickContinueButton(/Confirm and save/)

    cy.findByText('Alert deactivated').should('be.visible')
    cy.findByText('You have deactivated the AA (AA description) alert.').should('be.visible')

    cy.verifyLastAPICall(
      {
        method: 'POST',
        urlPath: `/alerts-api/alert-codes/AA/deactivate`,
      },
      undefined,
    )
  })
})
