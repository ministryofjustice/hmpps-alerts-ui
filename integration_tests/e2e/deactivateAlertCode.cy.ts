import IndexPage from '../pages'
import Page from '../pages/page'
import SelectAnAlertTypeForAlertCodeDeactivation from '../pages/selectAlertTypeForAlertCodeDeactivation'

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
    Page.verifyOnPage(SelectAnAlertTypeForAlertCodeDeactivation)
  })
})
