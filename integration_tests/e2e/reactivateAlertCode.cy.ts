import AuthorisedRoles from '../../server/authentication/authorisedRoles'

context('Reactivate an alert code', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER] })
    cy.task('stubGetAlertTypes')
    cy.task('stubReactivateAlertCode')
  })

  it('Deactivate an existing alert code - happy path', () => {
    cy.signIn()

    cy.clickLink('Update alerts and alert types')

    cy.clickRadio(/Alert$/)
    cy.clickContinueButton()

    cy.clickRadio('Reactivate alert')
    cy.clickContinueButton()

    cy.clickRadio('AA (A description)')
    cy.clickContinueButton()

    cy.clickRadio('BB (BB description) Deactivated')
    cy.clickContinueButton()

    // can change answers
    cy.findByRole('heading', { name: 'Check your changes' }).should('be.visible')
    cy.contains('dt', 'Alert type').next().should('include.text', 'AA (A description)')
    cy.contains('dt', 'Alert to be reactivated').next().should('include.text', 'BB (BB description)')

    cy.clickLink('Change the alert type')
    cy.clickRadio('AA (A description)')
    cy.clickContinueButton()
    cy.clickRadio('CC (CC description) Deactivated')
    cy.clickContinueButton()
    cy.contains('dt', 'Alert to be reactivated').next().should('include.text', 'CC (CC description)')

    cy.clickLink('Change the alert to be reactivated')
    cy.clickRadio('BB (BB description) Deactivated')
    cy.clickContinueButton()
    cy.contains('dt', 'Alert to be reactivated').next().should('include.text', 'BB (BB description)')

    // confirm and save
    cy.clickContinueButton(/Confirm and save/)

    cy.findByText('Alert reactivated').should('be.visible')
    cy.findByText('You have reactivated the BB (BB description) alert.').should('be.visible')

    cy.verifyLastAPICall(
      {
        method: 'POST',
        urlPath: `/alerts-api/alert-codes/BB/reactivate`,
      },
      undefined,
    )
  })
})
