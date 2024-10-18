import AuthorisedRoles from '../../authentication/authorisedRoles'

context('test /manage-reference-data screen', () => {
  beforeEach(() => {
    cy.task('reset')
  })

  it('shows all tiles when user has the required role', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
    navigateToTestPage()

    cy.findByRole('heading', { name: /Reference Data/i }).should('be.visible')
    cy.findByText('Manage alert types and codes, and upload secure alerts using this service.').should('be.visible')

    cy.findByRole('link', { name: /Add an alert type/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /\/alert-type\/create$/)
    cy.findByRole('link', { name: /Update alert type description/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /\/alert-type\/update-description$/)
    cy.findByRole('link', { name: /Add an alert code/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /\/alert-code\/create$/)
    cy.findByRole('link', { name: /Update alert code description/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /\/alert-code\/update-description$/)
    cy.findByRole('link', { name: /Deactivate an alert type/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /\/alert-type\/deactivate$/)
    cy.findByRole('link', { name: /Reactivate an alert type/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /\/alert-type\/reactivate$/)
    cy.findByRole('link', { name: /Deactivate an alert code/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /\/alert-code\/deactivate$/)
    cy.findByRole('link', { name: /Reactivate an alert code/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /\/alert-code\/reactivate$/)
  })

  it('shows unauthorised message if user does not have the required role', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_MANAGE_SECURE_ALERTS],
    })
    navigateToTestPage()
    cy.findByText('You are not authorised to use this application.').should('be.visible')
    cy.findByRole('heading', { name: /Reference Data/i }).should('not.exist')
  })

  const navigateToTestPage = () => {
    cy.signIn({ failOnStatusCode: false })
    cy.visit('/manage-reference-data', { failOnStatusCode: false })
  }
})
