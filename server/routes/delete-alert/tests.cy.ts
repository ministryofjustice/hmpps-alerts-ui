import AuthorisedRoles from '../../authentication/authorisedRoles'

context('test /delete-alert screen', () => {
  const submitButton = () => cy.findByRole('button', { name: /Delete alert/ })
  const alertUuidInput = () => cy.findByRole('textbox', { name: 'Enter the alert UUID' })

  const navigateToTestPage = () => {
    cy.signIn()
    cy.visit(`/delete-alert`, { failOnStatusCode: false })
  }

  beforeEach(() => {
    cy.task('reset')
  })

  it('Delete an existing alert - happy path', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_DPS_APPLICATION_DEVELOPER],
    })

    const alertUuid = 'c866a9ec-2f15-45fa-9041-460d3deda27d'
    cy.task('stubGetAlert', { id: alertUuid })
    cy.task('stubDeleteAlert', { id: alertUuid })

    navigateToTestPage()
    cy.url().should('to.match', /delete-alert$/)
    cy.checkAxeAccessibility()
    validatePageContents()

    alertUuidInput().type(alertUuid, { delay: 0 })
    submitButton().click()

    cy.url().should('to.match', /delete-alert$/)
    cy.findByText(`Deleted alert ${alertUuid}`).should('be.visible')
  })

  it('shows unauthorised message if user does not have DPS_APPLICATION_DEVELOPER role', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
    navigateToTestPage()
    cy.url().should('to.match', /delete-alert$/)
    cy.findByText('You are not authorised to use this application.').should('be.visible')
    cy.findByRole('heading', { name: /Delete an existing alert/i }).should('not.exist')
  })

  it('shows validation errors', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_DPS_APPLICATION_DEVELOPER],
    })

    navigateToTestPage()

    alertUuidInput().type('WRONG_FORMAT', { delay: 0 })
    submitButton().click()

    cy.findByRole('link', { name: /Enter a valid alert UUID/i })
      .should('be.visible')
      .click()
    alertUuidInput().should('be.focused')
  })

  it('shows error if no existing alert found for alert UUID', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_DPS_APPLICATION_DEVELOPER],
    })

    const alertUuid = '1db14f00-da8a-43f0-9513-d02a8312814a'
    cy.task('stubGetAlert', { id: alertUuid, responseCode: 404 })

    navigateToTestPage()

    alertUuidInput().type(alertUuid, { delay: 0 })
    submitButton().click()

    cy.findByRole('link', { name: /Unable to find existing alert/ })
      .should('be.visible')
      .click()
    alertUuidInput().should('be.focused')
  })

  const validatePageContents = () => {
    cy.findByRole('heading', { name: /Delete an existing alert/ }).should('be.visible')
    alertUuidInput().should('be.visible')
    submitButton().should('be.visible')
  }
})
