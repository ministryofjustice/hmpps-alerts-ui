import Page from '../pages/page'
import SelectAnAlertTypeForAlertCodeDeactivation from '../pages/selectAlertTypeForAlertCodeDeactivation'
import AlertTypeDeactivationConfirmationPage from '../pages/alertTypeDeactivationConfirmationPage'
import DeactivateAlertTypeSuccessPage from '../pages/deactivateAlertTypeSuccessPage'
import AuthorisedRoles from '../../server/authentication/authorisedRoles'
import ReferenceDataHomepage from '../pages/referenceDataHomepage'

context('Deactivate an alert type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER] })
    cy.task('stubGetAlertTypes')
    cy.task('stubDeactivateAlertType')
  })

  it('Deactivate an existing alert type - happy path', () => {
    cy.signIn()
    ReferenceDataHomepage.goTo().deactivateAlertTypeLink().click()
    const selectAlertTypePage = Page.verifyOnPage(SelectAnAlertTypeForAlertCodeDeactivation)
    selectAlertTypePage.selectCode().click()
    selectAlertTypePage.continue().click()
    const confirmationPage = Page.verifyOnPageWithArgs(AlertTypeDeactivationConfirmationPage, 'DB')
    confirmationPage.selectYes().click()
    confirmationPage.continue().click()
    Page.verifyOnPage(DeactivateAlertTypeSuccessPage)
  })
})
