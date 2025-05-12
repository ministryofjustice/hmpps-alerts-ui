import AuthorisedRoles from '../../server/authentication/authorisedRoles'

context('Create an alert code', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER] })
    cy.task('stubGetAlertTypes')
    cy.task('stubCreateAlertCode')
  })

  it('Create a new alert code - happy path', () => {
    cy.signIn()

    cy.clickLink('Update alerts and alert types')

    cy.clickRadio(/Alert$/)
    cy.clickContinueButton()

    cy.clickRadio('Add new alert')
    cy.clickContinueButton()

    cy.clickRadio('DB (DB description)')
    cy.clickContinueButton()

    cy.fillTextbox('Enter an alert code', 'ZYX')
    cy.fillTextbox('Enter a description of the alert', 'Some text')
    cy.clickContinueButton()

    // can change answers
    cy.findByRole('heading', { name: 'Check your changes' }).should('be.visible')
    cy.contains('dt', 'Alert type').next().should('include.text', 'DB (DB description)')
    cy.contains('dt', 'New alert code').next().should('include.text', 'ZYX')
    cy.contains('dt', 'New alert description').next().should('include.text', 'Some text')

    cy.clickLink('Change the alert type')
    cy.clickRadio('AA (A description)')
    cy.clickContinueButton()
    cy.contains('dt', 'Alert type').next().should('include.text', 'AA (A description)')

    cy.clickLink('Change the alert code')
    cy.fillTextbox('Enter an alert code', 'ABC')
    cy.clickContinueButton()
    cy.contains('dt', 'New alert code').next().should('include.text', 'ABC')

    cy.clickLink('Change the alert description')
    cy.fillTextbox('Enter a description of the alert', 'This is a description')
    cy.clickContinueButton()
    cy.contains('dt', 'New alert description').next().should('include.text', 'This is a description')

    // confirm and save
    cy.clickContinueButton(/Confirm and save/)

    cy.findByText('Alert added').should('be.visible')
    cy.findByText('You have added the This is a description alert.').should('be.visible')

    cy.verifyLastAPICall(
      {
        method: 'POST',
        urlPath: `/alerts-api/alert-codes`,
      },
      {
        parent: 'AA',
        code: 'ABC',
        description: 'This is a description',
      },
    )
  })
})
