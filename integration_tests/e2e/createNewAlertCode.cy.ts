import IndexPage from '../pages'
import Page from '../pages/page'
import AddAnAlertCode from '../pages/addAnAlertCode'

context('Create an alert code', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
  })

  it('Create a new alert code - happy path', () => {
    cy.signIn()
    IndexPage.goTo().createAlertCodeLink().click()
    Page.verifyOnPage(AddAnAlertCode)
  })
})
