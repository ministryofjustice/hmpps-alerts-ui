import AuthorisedRoles from '../../../authentication/authorisedRoles'

context('test /bulk-alerts screen', () => {
  const getContinueButton = () => cy.findByRole('button', { name: /Continue/ })
  const getAlertTypeInput = () => cy.findByRole('combobox', { name: /Type of alert/ })
  const getAlertCodeInput = () => cy.findByRole('combobox', { name: /^Alert$/ })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubGetAlertTypes')
  })

  it('select alert - happy path', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS],
    })

    navigateToTestPage()
    cy.url().should('to.match', /\/bulk-alerts$/)
    validatePageContents()
    validateErrorMessages()

    getAlertTypeInput().select('DB description')
    getAlertCodeInput().select('AA description')
    getContinueButton().click()
    cy.url().should('to.match', /\/bulk-alerts\/enter-alert-reason$/)

    cy.go('back')
    cy.reload()
    getAlertTypeInput().should('have.value', 'DB')
    getAlertCodeInput().should('have.value', 'AA')

    getAlertCodeInput().select('OCG Nominal')
    getContinueButton().click()
    cy.url().should('to.match', /\/bulk-alerts\/how-to-add-prisoners$/)
  })

  it('shows unauthorised message if user does not have BULK_PRISON_ESTATE_ALERTS role', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
    navigateToTestPage()
    cy.url().should('to.match', /\/bulk-alerts$/)
    cy.findByText('You are not authorised to use this application.').should('be.visible')
    cy.findByRole('heading', { name: /Select alert/i }).should('not.exist')
  })

  const navigateToTestPage = () => {
    cy.signIn()
    cy.visit('/bulk-alerts', { failOnStatusCode: false })
  }

  const validatePageContents = () => {
    cy.title().should('equal', 'Select alert - Manage alerts in bulk for the prison estate - DPS')
    cy.findByRole('heading', { name: /Select alert/i }).should('be.visible')
    getContinueButton().should('be.visible')
    getAlertTypeInput().should('be.visible')
    getAlertCodeInput().should('be.visible')
  }

  const validateErrorMessages = () => {
    getContinueButton().click()

    cy.findByRole('link', { name: /You must select an alert type$/i })
      .should('be.visible')
      .click()
    getAlertTypeInput().should('be.focused')
    cy.findByRole('link', { name: /You must select an alert$/i })
      .should('be.visible')
      .click()
    getAlertCodeInput().should('be.focused')
  }
})
