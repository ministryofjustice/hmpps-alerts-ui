import IndexPage from '../pages'
import Page from '../pages/page'
import SelectAnAlertType from '../pages/selectAnAlertType'
import EnterDescriptionForUpdateAlertType from '../pages/enterDescriptionForUpdateAlertType'
import UpdateAlertTypeDescriptionConfirmationPage from '../pages/updateAlertTypeDescriptionConfirmationPage'

context('Update alert type description', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('stubGetAlertTypes')
  })

  it('Update description of an alert type - happy path', () => {
    cy.signIn()
    IndexPage.goTo().updateAlertTypeLink().click()
    const selectAlertTypePage = Page.verifyOnPage(SelectAnAlertType)
    selectAlertTypePage.selectCode().click()
    selectAlertTypePage.continue().click()
    const enterDescriptionPage = Page.verifyOnPage(EnterDescriptionForUpdateAlertType)
    enterDescriptionPage.descriptionField().click().clear().type('New Description')
    enterDescriptionPage.continue().click()
    const confirmationPage = Page.verifyOnPageWithArgs(
      UpdateAlertTypeDescriptionConfirmationPage,
      'DB',
      'New Description',
    )
    confirmationPage.selectYes().click()
    confirmationPage.continue().click()
  })
})
