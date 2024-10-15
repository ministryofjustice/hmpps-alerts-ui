import AuthorisedRoles from '../../authentication/authorisedRoles'

context('Deactivate an alert type', () => {
  const getContinueButton = () => cy.findByRole('button', { name: /Add alert/ })
  const getPrisonNumberInput = () => cy.findByRole('textbox', { name: 'Enter prison number' })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubGetAlertTypes')
  })

  it('create an alert - happy path', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_MANAGE_SECURE_ALERTS],
    })
    navigateToTestPage()
    cy.url().should('to.match', /add-any-alert$/)
    validatePageContents()
  })

  it('shows unauthorised message if user does not have MANAGE_SECURE_ALERTS role', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
    navigateToTestPage()
    cy.url().should('to.match', /add-any-alert$/)
    cy.findByText('You are not authorised to use this application.').should('be.visible')
    cy.findByRole('heading', { name: /Add an alert/i }).should('not.exist')
  })

  const navigateToTestPage = () => {
    cy.signIn()
    cy.visit(`/add-any-alert`, { failOnStatusCode: false })
  }

  const validatePageContents = () => {
    cy.findByRole('heading', { name: /Add an alert/i }).should('be.visible')
    getContinueButton().should('be.visible')
    getPrisonNumberInput().should('be.visible')
  }
})
