import IndexPage from '../pages'
import Page from '../pages/page'
import SelectAnAlertTypeForAlertCodeDeactivation from '../pages/selectAlertTypeForAlertCodeDeactivation'
import AlertTypeDeactivationConfirmationPage from '../pages/alertTypeDeactivationConfirmationPage'
import DeactivateAlertTypeSuccessPage from '../pages/deactivateAlertTypeSuccessPage'

context('Deactivate an alert type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('stubGetAlertTypes')
    cy.task('stubDeactivateAlertType')
  })

  it('Deactivate an existing alert type - happy path', () => {
    cy.signIn()
    IndexPage.goTo().deactivateAlertTypeLink().click()
    const selectAlertTypePage = Page.verifyOnPage(SelectAnAlertTypeForAlertCodeDeactivation)
    selectAlertTypePage.selectCode().click()
    selectAlertTypePage.continue().click()
    const confirmationPage = Page.verifyOnPageWithArgs(AlertTypeDeactivationConfirmationPage, 'DB')
    confirmationPage.selectYes().click()
    confirmationPage.continue().click()
    Page.verifyOnPage(DeactivateAlertTypeSuccessPage)
  })
})
