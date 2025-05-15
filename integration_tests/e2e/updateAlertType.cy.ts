import AuthorisedRoles from '../../server/authentication/authorisedRoles'

context('Update alert type description', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER] })
    cy.task('stubGetAlertTypes')
    cy.task('stubUpdateAlertType')
  })

  it('Update description of an alert type - happy path', () => {
    cy.signIn()

    cy.clickLink('Update alerts and alert types')

    cy.clickRadio(/Alert type$/)
    cy.clickContinueButton()

    cy.clickRadio('Edit alert type description')
    cy.clickContinueButton()

    cy.clickRadio('DB (DB description)')
    cy.clickContinueButton()

    cy.fillTextbox('Enter a new alert type description', 'Some text')
    cy.clickContinueButton()

    // can change answers
    cy.findByRole('heading', { name: 'Check your changes' }).should('be.visible')
    cy.contains('dt', 'Alert type').next().should('include.text', 'DB (DB description)')
    cy.contains('dt', 'New alert type description').next().should('include.text', 'Some text')

    cy.clickLink('Change the alert type')
    cy.clickRadio('AA (A description)')
    cy.clickContinueButton()
    cy.contains('dt', 'Alert type').next().should('include.text', 'AA (A description)')

    cy.clickLink('Change the new alert type description')
    cy.fillTextbox('Enter a new alert type description', 'This is a description')
    cy.clickContinueButton()
    cy.contains('dt', 'New alert type description').next().should('include.text', 'This is a description')

    // confirm and save
    cy.clickContinueButton(/Confirm and save/)

    cy.findByText('Alert type description updated').should('be.visible')
    cy.findByText('You have updated the description for the AA alert type to ‘This is a description’.').should(
      'be.visible',
    )

    cy.verifyLastAPICall(
      {
        method: 'PATCH',
        urlPath: `/alerts-api/alert-types/AA`,
      },
      {
        description: 'This is a description',
      },
    )
  })
})
