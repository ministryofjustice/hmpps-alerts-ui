import IndexPage from '../pages/index'
import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'
import AuthManageDetailsPage from '../pages/authManageDetails'
import AuthorisedRoles from '../../server/authentication/authorisedRoles'

context('Sign In', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER] })
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('Unauthenticated user navigating to sign in page directed to auth', () => {
    cy.visit('/sign-in')
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User name visible in header', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.headerUserName().should('contain.text', 'J. Smith')
  })

  it('Phase banner visible in header', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.headerPhaseBanner().should('contain.text', 'dev')
  })

  it('User can sign out', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    indexPage.signOut().click()
    Page.verifyOnPage(AuthSignInPage)
  })

  it('User can manage their details', () => {
    cy.signIn()
    cy.task('stubAuthManageDetails')
    const indexPage = Page.verifyOnPage(IndexPage)

    indexPage.manageDetails().get('a').invoke('removeAttr', 'target')
    indexPage.manageDetails().click()
    Page.verifyOnPage(AuthManageDetailsPage)
  })

  it('Token verification failure takes user to sign in page', () => {
    cy.signIn()
    Page.verifyOnPage(IndexPage)
    cy.task('stubVerifyToken', false)

    // can't do a visit here as cypress requires only one domain
    cy.request('/').its('body').should('contain', 'Sign in')
  })

  it('Token verification failure clears user session', () => {
    cy.signIn()
    const indexPage = Page.verifyOnPage(IndexPage)
    cy.task('stubVerifyToken', false)

    // can't do a visit here as cypress requires only one domain
    cy.request('/').its('body').should('contain', 'Sign in')

    cy.task('stubVerifyToken', true)
    cy.task('stubSignIn', { name: 'bobby brown', roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER] })

    cy.signIn()

    indexPage.headerUserName().contains('B. Brown')
  })
})
