import Page from '../pages/page'
import SelectAnAlertType from '../pages/selectAnAlertType'
import SelectAlertCodePage from '../pages/selectAlertCodePage'
import EnterDescriptionForUpdateAlertCode from '../pages/enterDescriptionForUpdateAlertCode'
import UpdateAlertCodeDescriptionConfirmationPage from '../pages/updateAlertCodeDescriptionConfirmationPage'
import UpdateAlertCodeDescriptionSuccessPage from '../pages/updateAlertCodeDescriptionSuccessPage'
import AuthorisedRoles from '../../server/authentication/authorisedRoles'
import ReferenceDataHomepage from '../pages/referenceDataHomepage'

context('Update alert code description', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER] })
    cy.task('stubGetAlertTypes')
    cy.task('stubUpdateAlertCode')
  })

  it('Update description of an alert code - happy path', () => {
    cy.signIn()
    ReferenceDataHomepage.goTo().updateAlertCodeLink().click()
    const selectAlertTypePage = Page.verifyOnPage(SelectAnAlertType)
    selectAlertTypePage.selectCode().click()
    selectAlertTypePage.continue().click()
    const selectAlertCodePage = Page.verifyOnPage(SelectAlertCodePage)
    selectAlertCodePage.selectCode().click()
    selectAlertCodePage.continue().click()
    const enterDescriptionPage = Page.verifyOnPage(EnterDescriptionForUpdateAlertCode)
    enterDescriptionPage.descriptionField().click().clear().type('New Description')
    enterDescriptionPage.continue().click()
    const confirmationPage = Page.verifyOnPageWithArgs(
      UpdateAlertCodeDescriptionConfirmationPage,
      'AA',
      'New Description',
    )
    confirmationPage.selectYes().click()
    confirmationPage.continue().click()
    Page.verifyOnPage(UpdateAlertCodeDescriptionSuccessPage)
  })
})
