import IndexPage from '../pages'
import Page from '../pages/page'
import SelectAnAlertTypeForAlertCodeDeactivation from '../pages/selectAlertTypeForAlertCodeDeactivation'
import SelectAlertCodeForDeactivationPage from '../pages/selectAlertCodeForDeactivationPage'

context('Deactivate an alert code', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('stubGetAlertTypes')
  })

  it('Deactivate an existing alert code - happy path', () => {
    cy.signIn()
    IndexPage.goTo().deactivateAlertCodeLink().click()
    const selectAlertTypePage = Page.verifyOnPage(SelectAnAlertTypeForAlertCodeDeactivation)
    selectAlertTypePage.selectCode().click()
    selectAlertTypePage.continue().click()
    Page.verifyOnPage(SelectAlertCodeForDeactivationPage)
  })
})
