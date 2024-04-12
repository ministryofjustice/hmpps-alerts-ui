import IndexPage from '../pages'
import Page from '../pages/page'
import AddAnAlertCode from '../pages/addAnAlertCode'
import SelectAnAlertType from '../pages/selectAnAlertType'
import AddAnAlertCodeConfirmationPage from '../pages/addAnAlertCodeConfirmationPage'
import AlertCodeSuccessPage from '../pages/alertCodeSuccessPage'

context('Create an alert code', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('stubGetAlertTypes')
    cy.task('stubCreateAlertCode')
  })

  it('Create a new alert code - happy path', () => {
    cy.signIn()
    IndexPage.goTo().createAlertCodeLink().click()
    const selectAlertType = Page.verifyOnPage(SelectAnAlertType)
    selectAlertType.selectCode().check({ force: true })
    selectAlertType.selectCode().should('be.checked')
    selectAlertType.continue().click()
    const addDetails = Page.verifyOnPage(AddAnAlertCode)
    addDetails.codeInput().type('AA')
    addDetails.descriptionInput().type('A description')
    addDetails.continue().click()
    const confirmation = Page.verifyOnPage(AddAnAlertCodeConfirmationPage)
    confirmation.code().should('have.value', 'AA')
    confirmation.description().should('have.value', 'A description')
    confirmation.parent().should('have.value', 'DB')
    confirmation.continue().click()
    Page.verifyOnPage(AlertCodeSuccessPage)
  })
})
