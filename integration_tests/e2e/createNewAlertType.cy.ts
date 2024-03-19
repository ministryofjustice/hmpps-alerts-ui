import IndexPage from '../pages'
import AddAnAlertType from '../pages/addAnAlertType'
import Page from '../pages/page'

context('Create an alert type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
  })

  it('Visit Calculation complete page', () => {
    cy.signIn()
    IndexPage.goTo().createAlertTypeLink().click()
    Page.verifyOnPage(AddAnAlertType)
  })
})
