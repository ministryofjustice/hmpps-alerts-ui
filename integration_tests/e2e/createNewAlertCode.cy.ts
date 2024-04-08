import IndexPage from '../pages'
import Page from '../pages/page'
import AddAnAlertCode from '../pages/addAnAlertCode'
import SelectAnAlertType from '../pages/selectAnAlertType'

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
    Page.verifyOnPage(AddAnAlertCode)
  })
})
