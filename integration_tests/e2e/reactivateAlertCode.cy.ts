import Page from '../pages/page'
import SelectAlertCodePage from '../pages/selectAlertCodePage'
import SelectAnAlertType from '../pages/selectAnAlertType'
import AlertCodeReactivationConfirmationPage from '../pages/alertCodeReactivationConfirmationPage'
import ReactivateAlertCodeSuccessPage from '../pages/reactivateAlertCodeSuccessPage'
import AuthorisedRoles from '../../server/authentication/authorisedRoles'
import ReferenceDataHomepage from '../pages/referenceDataHomepage'

context('Reactivate an alert code', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER] })
    cy.task('stubGetDeactivatedAlertCodes')
    cy.task('stubReactivateAlertCode')
  })

  it('Deactivate an existing alert code - happy path', () => {
    cy.signIn()
    ReferenceDataHomepage.goTo().reactivateAlertCodeLink().click()
    const selectAlertTypePage = Page.verifyOnPage(SelectAnAlertType)
    selectAlertTypePage.selectCode().click()
    selectAlertTypePage.continue().click()
    const selectAlertCodePage = Page.verifyOnPage(SelectAlertCodePage)
    selectAlertCodePage.selectCode().click()
    selectAlertCodePage.continue().click()
    const confirmationPage = Page.verifyOnPageWithArgs(AlertCodeReactivationConfirmationPage, 'AA')
    confirmationPage.selectYes().click()
    confirmationPage.continue().click()
    Page.verifyOnPage(ReactivateAlertCodeSuccessPage)
  })
})
