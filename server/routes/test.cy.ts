import AuthorisedRoles from '../authentication/authorisedRoles'

context('test / homepage', () => {
  beforeEach(() => {
    cy.task('reset')
  })

  it('shows all tiles when user has all required roles', () => {
    cy.task('stubSignIn', {
      roles: [
        AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS,
        AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER,
        AuthorisedRoles.ROLE_DPS_APPLICATION_DEVELOPER,
      ],
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

    cy.findByRole('link', { name: /Delete alert/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /\/delete-alert$/)

    cy.findByRole('link', { name: /Manage alert restrictions/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /\/manage-alert-restrictions$/)

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

    cy.findByRole('link', { name: /Delete alert/i }).should('not.exist')
    cy.findByRole('link', { name: /Manage alert restrictions/i }).should('not.exist')

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
    cy.findByRole('link', { name: /Delete alert/i }).should('not.exist')
    cy.findByRole('link', { name: /Manage alert restrictions/i }).should('not.exist')

    cy.checkAxeAccessibility()
  })

  it('shows only DPS admin tiles if user only has ROLE_DPS_APPLICATION_DEVELOPER', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_DPS_APPLICATION_DEVELOPER],
    })
    navigateToTestPage()

    cy.findByRole('heading', { name: /Manage prisoner alerts/i }).should('be.visible')

    cy.findByRole('link', { name: /Delete alert/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /\/delete-alert$/)

    cy.findByRole('link', { name: /Manage alert restrictions/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /\/manage-alert-restrictions$/)

    cy.findByRole('link', { name: /Manage alerts in bulk for the prison estate/i }).should('not.exist')
    cy.findByRole('link', { name: /Add alert for prison number/i }).should('not.exist')
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
