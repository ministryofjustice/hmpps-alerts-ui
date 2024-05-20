import IndexPage from '../pages'
import Page from '../pages/page'
import SelectAnAlertTypeForAlertCodeDeactivation from '../pages/selectAlertTypeForAlertCodeDeactivation'
import SelectAlertCodePage from '../pages/selectAlertCodePage'
import AlertCodeDeactivationConfirmationPage from '../pages/alertCodeDeactivationConfirmationPage'
import DeactivateAlertCodeSuccessPage from '../pages/deactivateAlertCodeSuccessPage'

context('Deactivate an alert code', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubVerifyToken', true)
    cy.task('stubSignIn', { name: 'bobby brown' })
    cy.task('stubGetAlertTypes')
    cy.task('stubDeactivateAlertCode')
  })

  it('Deactivate an existing alert code - happy path', () => {
    cy.signIn()
    IndexPage.goTo().deactivateAlertCodeLink().click()
    const selectAlertTypePage = Page.verifyOnPage(SelectAnAlertTypeForAlertCodeDeactivation)
    selectAlertTypePage.selectCode().click()
    selectAlertTypePage.continue().click()
    const selectAlertCodePage = Page.verifyOnPage(SelectAlertCodePage)
    selectAlertCodePage.selectCode().click()
    selectAlertCodePage.continue().click()
    const confirmationPage = Page.verifyOnPageWithArgs(AlertCodeDeactivationConfirmationPage, 'AA')
    confirmationPage.selectYes().click()
    confirmationPage.continue().click()
    Page.verifyOnPage(DeactivateAlertCodeSuccessPage)
  })
})
