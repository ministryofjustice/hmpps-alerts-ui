import AuthorisedRoles from '../../server/authentication/authorisedRoles'

context('Update alert code description', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER] })
    cy.task('stubGetAlertTypes')
    cy.task('stubUpdateAlertCode')
  })

  it('Update description of an alert code - happy path', () => {
    cy.signIn()

    cy.clickLink('Update alerts and alert types')

    cy.clickRadio(/Alert$/)
    cy.clickContinueButton()

    cy.clickRadio('Edit alert description')
    cy.clickContinueButton()

    cy.clickRadio('DB (DB description)')
    cy.clickContinueButton()

    cy.clickRadio('AA (AA description)')
    cy.clickContinueButton()

    cy.fillTextbox('Enter a new alert description', 'Some text')
    cy.clickContinueButton()

    // can change answers
    cy.findByRole('heading', { name: 'Check your changes' }).should('be.visible')
    cy.contains('dt', 'Alert type').next().should('include.text', 'DB (DB description)')
    cy.contains('dt', /Alert\s+$/)
      .next()
      .should('include.text', 'AA (AA description)')
    cy.contains('dt', 'New alert description').next().should('include.text', 'Some text')

    cy.clickLink('Change the alert type')
    cy.clickRadio('AA (A description)')
    cy.clickContinueButton()
    cy.clickRadio('BB (BB description) Deactivated')
    cy.clickContinueButton()
    cy.contains('dt', 'Alert type').next().should('include.text', 'AA (A description)')
    cy.contains('dt', /Alert\s+$/)
      .next()
      .should('include.text', 'BB (BB description)')

    cy.clickLink('Change the alert to be edited')
    cy.clickRadio('CC (CC description) Deactivated')
    cy.clickContinueButton()
    cy.contains('dt', /Alert\s+$/)
      .next()
      .should('include.text', 'CC (CC description)')

    cy.clickLink('Change the new alert description')
    cy.fillTextbox('Enter a new alert description', 'This is a description')
    cy.clickContinueButton()
    cy.contains('dt', 'New alert description').next().should('include.text', 'This is a description')

    // confirm and save
    cy.clickContinueButton(/Confirm and save/)

    cy.findByText('Alert description updated').should('be.visible')
    cy.findByText('You have updated the description for the CC alert to ‘This is a description’.').should('be.visible')

    cy.verifyLastAPICall(
      {
        method: 'PATCH',
        urlPath: `/alerts-api/alert-codes/CC`,
      },
      {
        description: 'This is a description',
      },
    )
  })
})
