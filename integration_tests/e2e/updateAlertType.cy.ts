import Page from '../pages/page'
import SelectAnAlertType from '../pages/selectAnAlertType'
import EnterDescriptionForUpdateAlertType from '../pages/enterDescriptionForUpdateAlertType'
import UpdateAlertTypeDescriptionConfirmationPage from '../pages/updateAlertTypeDescriptionConfirmationPage'
import UpdateAlertTypeDescriptionSuccessPage from '../pages/updateAlertTypeDescriptionSuccessPage'
import AuthorisedRoles from '../../server/authentication/authorisedRoles'
import ReferenceDataHomepage from '../pages/referenceDataHomepage'

context('Update alert type description', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER] })
    cy.task('stubGetAlertTypes')
    cy.task('stubUpdateAlertType')
  })

  it('Update description of an alert type - happy path', () => {
    cy.signIn()
    ReferenceDataHomepage.goTo().updateAlertTypeLink().click()
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
    Page.verifyOnPage(UpdateAlertTypeDescriptionSuccessPage)
  })
})
