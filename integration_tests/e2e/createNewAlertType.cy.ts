import IndexPage from '../pages'
import AddAnAlertType from '../pages/addAnAlertType'
import Page from '../pages/page'
import AddAnAlertTypeConfirmationPage from '../pages/addAnAlertTypeConfirmationPage'
import AlertTypeSuccessPage from '../pages/alertTypeSuccessPage'
import AuthorisedRoles from '../../server/authentication/authorisedRoles'

context('Create an alert type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER] })
    cy.task('stubCreateAlertType')
  })

  it('Create a new alert type - happy path', () => {
    cy.signIn()
    IndexPage.goTo().createAlertTypeLink().click()
    const addAlertPage = Page.verifyOnPage(AddAnAlertType)
    addAlertPage.codeInput().type('ABC')
    addAlertPage.descriptionInput().type('This is a description')
    addAlertPage.continue().click()
    const confirmationPage = Page.verifyOnPage(AddAnAlertTypeConfirmationPage)
    confirmationPage.code().should('have.value', 'ABC')
    confirmationPage.description().should('have.value', 'This is a description')
    confirmationPage.continue().click()
    Page.verifyOnPage(AlertTypeSuccessPage)
  })
})
