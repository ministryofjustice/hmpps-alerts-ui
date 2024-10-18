import Page from '../pages/page'
import SelectAnAlertType from '../pages/selectAnAlertType'
import AlertTypeReactivationConfirmationPage from '../pages/alertTypeReactivationConfirmationPage'
import ReactivateAlertTypeSuccessPage from '../pages/reactivateAlertTypeSuccessPage'
import AuthorisedRoles from '../../server/authentication/authorisedRoles'
import ReferenceDataHomepage from '../pages/referenceDataHomepage'

context('Reactivate an alert type', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', { roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER] })
    cy.task('stubGetDeactivatedAlertTypes')
    cy.task('stubReactivateAlertType')
  })

  it('Reactivate a reactivated alert type - happy path', () => {
    cy.signIn()
    ReferenceDataHomepage.goTo().reactivateAlertTypeLink().click()
    const selectAlertTypePage = Page.verifyOnPage(SelectAnAlertType)
    selectAlertTypePage.selectCode().click()
    selectAlertTypePage.continue().click()
    const confirmationPage = Page.verifyOnPageWithArgs(AlertTypeReactivationConfirmationPage, 'DB')
    confirmationPage.selectYes().click()
    confirmationPage.continue().click()
    Page.verifyOnPage(ReactivateAlertTypeSuccessPage)
  })
})
