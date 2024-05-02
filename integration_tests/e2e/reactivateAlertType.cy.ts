import IndexPage from '../pages'
import Page from '../pages/page'
import SelectAnAlertType from '../pages/selectAnAlertType'
import AlertTypeReactivationConfirmationPage from '../pages/alertTypeReactivationConfirmationPage'
import ReactivateAlertTypeSuccessPage from '../pages/reactivateAlertTypeSuccessPage'

context('Reactivate an alert type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('stubGetDeactivatedAlertTypes')
    cy.task('stubReactivateAlertType')
  })

  it('Reactivate a reactivated alert type - happy path', () => {
    cy.signIn()
    IndexPage.goTo().reactivateAlertTypeLink().click()
    const selectAlertTypePage = Page.verifyOnPage(SelectAnAlertType)
    selectAlertTypePage.selectCode().click()
    selectAlertTypePage.continue().click()
    const confirmationPage = Page.verifyOnPageWithArgs(AlertTypeReactivationConfirmationPage, 'DB')
    confirmationPage.selectYes().click()
    confirmationPage.continue().click()
    Page.verifyOnPage(ReactivateAlertTypeSuccessPage)
  })
})
