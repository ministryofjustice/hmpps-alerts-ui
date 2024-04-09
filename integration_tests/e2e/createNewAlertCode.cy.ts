import IndexPage from '../pages'
import Page from '../pages/page'
import AddAnAlertCode from '../pages/addAnAlertCode'
import SelectAnAlertType from '../pages/selectAnAlertType'
import AddAnAlertCodeConfirmationPage from '../pages/addAnAlertCodeConfirmationPage'

context('Create an alert code', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('stubGetAlertTypes')
  })

  it('Create a new alert code - happy path', () => {
    cy.signIn()
    IndexPage.goTo().createAlertCodeLink().click()
    const selectAlertType = Page.verifyOnPage(SelectAnAlertType)
    selectAlertType.selectCode().click()
    selectAlertType.continue().click()
    const addDetails = Page.verifyOnPage(AddAnAlertCode)
    addDetails.codeInput().type('AA')
    addDetails.descriptionInput().type('A description')
    addDetails.continue().click()
    Page.verifyOnPage(AddAnAlertCodeConfirmationPage)
  })
})
