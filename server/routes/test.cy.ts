import AuthorisedRoles from '../authentication/authorisedRoles'

context('test / homepage', () => {
  beforeEach(() => {
    cy.task('reset')
  })

  it('shows all tiles when user has all required roles', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS, AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
    navigateToTestPage()

    cy.findByRole('heading', { name: /Manage prisoner alerts/i }).should('be.visible')
    cy.findByRole('link', { name: /Add alert for prison number/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /\/add-any-alert$/)

    cy.findByRole('link', { name: /Update alerts and alert types/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /\/update-reference-data$/)

    cy.checkAxeAccessibility()
  })

  it('shows only ref data tile if user only has ROLE_ALERTS_REFERENCE_DATA_MANAGER', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
    navigateToTestPage()

    cy.findByRole('heading', { name: /Manage prisoner alerts/i }).should('be.visible')
    cy.findByRole('link', { name: /Add alert for prison number/i }).should('not.exist')

    cy.findByRole('link', { name: /Update alerts and alert types/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /\/update-reference-data$/)

    cy.checkAxeAccessibility()
  })

  it('shows only add alert tile if user only has ROLE_BULK_PRISON_ESTATE_ALERTS', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS],
    })
    navigateToTestPage()

    cy.findByRole('heading', { name: /Manage prisoner alerts/i }).should('be.visible')
    cy.findByRole('link', { name: /Add alert for prison number/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /\/add-any-alert$/)

    cy.findByRole('link', { name: /Update alerts and alert types/i }).should('not.exist')

    cy.checkAxeAccessibility()
  })

  it('shows unauthorised message if user does not have any of the required roles', () => {
    cy.task('stubSignIn', {
      roles: [],
    })
    navigateToTestPage()
    cy.findByText('You are not authorised to use this application.').should('be.visible')
    cy.findByRole('heading', { name: /Manage prisoner alerts/i }).should('not.exist')

    cy.checkAxeAccessibility()
  })

  const navigateToTestPage = () => {
    cy.signIn({ failOnStatusCode: false })
    cy.visit('/', { failOnStatusCode: false })
  }
})
