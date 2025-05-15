import AuthorisedRoles from '../../server/authentication/authorisedRoles'

context('Create an alert type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER] })
    cy.task('stubGetAlertTypes')
    cy.task('stubCreateAlertType')
  })

  it('Create a new alert type - happy path', () => {
    cy.signIn()

    cy.clickLink('Update alerts and alert types')

    cy.clickRadio(/Alert type$/)
    cy.clickContinueButton()

    cy.clickRadio('Add new alert type')
    cy.clickContinueButton()

    cy.fillTextbox('Enter an alert type code', 'ZYX')
    cy.fillTextbox('Enter a description of the alert type', 'Some text')
    cy.clickContinueButton()

    // can change answers
    cy.findByRole('heading', { name: 'Check your changes' }).should('be.visible')
    cy.contains('dt', 'New alert type').next().should('include.text', 'ZYX')
    cy.contains('dt', 'New alert description').next().should('include.text', 'Some text')

    cy.clickLink('Change the alert type code')
    cy.fillTextbox('Enter an alert type code', 'ABC')
    cy.clickContinueButton()
    cy.contains('dt', 'New alert type').next().should('include.text', 'ABC')

    cy.clickLink('Change the alert type description')
    cy.fillTextbox('Enter a description of the alert type', 'This is a description')
    cy.clickContinueButton()
    cy.contains('dt', 'New alert description').next().should('include.text', 'This is a description')

    // confirm and save
    cy.clickContinueButton(/Confirm and save/)

    cy.findByText('Alert type added').should('be.visible')
    cy.findByText('You have added the This is a description alert type.').should('be.visible')

    cy.verifyLastAPICall(
      {
        method: 'POST',
        urlPath: `/alerts-api/alert-types`,
      },
      {
        code: 'ABC',
        description: 'This is a description',
      },
    )
  })
})
