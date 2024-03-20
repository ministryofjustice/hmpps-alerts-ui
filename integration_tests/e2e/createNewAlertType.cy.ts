import IndexPage from '../pages'
import AddAnAlertType from '../pages/addAnAlertType'
import Page from '../pages/page'
import AddAnAlertTypeConfirmationPage from '../pages/addAnAlertTypeConfirmationPage'

context('Create an alert type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
  })

  it('Visit Calculation complete page', () => {
    cy.signIn()
    IndexPage.goTo().createAlertTypeLink().click()
    const addAlertPage = Page.verifyOnPage(AddAnAlertType)
    addAlertPage.codeInput().type('ABC')
    addAlertPage.descriptionInput().type('This is a description')
    addAlertPage.continue().click()
    Page.verifyOnPage(AddAnAlertTypeConfirmationPage)
  })
})
