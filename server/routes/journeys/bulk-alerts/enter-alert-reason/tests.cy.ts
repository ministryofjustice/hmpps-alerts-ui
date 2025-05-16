import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'

context('test /bulk-alerts/enter-alert-reason screen', () => {
  const uuid = uuidV4()

  const getContinueButton = () => cy.findByRole('button', { name: /Continue/ })
  const getDescriptionInput = () => cy.findByRole('textbox', { name: /Enter why you are creating this alert$/ })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubGetAlertTypes')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS],
    })
  })

  it('should try out all cases', () => {
    navigateToTestPage()
    cy.url().should('to.match', /\/bulk-alerts\/enter-alert-reason$/)
    cy.checkAxeAccessibility()
    validatePageContents()
    validateErrorMessages()
    proceedToNextPage()
    validateAnswersArePersisted()
  })

  const navigateToTestPage = () => {
    cy.signIn()
    cy.visit(`/${uuid}/bulk-alerts`, { failOnStatusCode: false })
    cy.visit(`/${uuid}/bulk-alerts/enter-alert-reason`)
  }

  const validatePageContents = () => {
    cy.title().should('equal', 'Enter why you are creating this alert - Upload alerts in bulk - DPS')
    cy.findByRole('heading', { name: /Enter why you are creating this alert/i }).should('be.visible')
    getContinueButton().should('be.visible')
    getDescriptionInput().should('be.visible')
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /bulk-alerts$/)
  }

  const validateErrorMessages = () => {
    getContinueButton().click()
    cy.findByRole('link', { name: /You must enter why you are creating this alert$/i })
      .should('be.visible')
      .click()
    getDescriptionInput().should('be.focused')

    getDescriptionInput().type('n'.repeat(4001), { delay: 0 })
    getContinueButton().click()
    cy.findByRole('link', { name: /Enter why you are creating this alert using 4,000 characters or less$/i })
      .should('be.visible')
      .click()
    getDescriptionInput().should('be.focused')
    cy.findAllByText('You have 1 character too many').filter(':visible').should('have.length.of.at.least', 1)
  }

  const proceedToNextPage = () => {
    getDescriptionInput().clear().type(`<script>alert('xss-description');</script>`, { delay: 0 })
    getContinueButton().click()
    cy.url().should('to.match', /\/bulk-alerts\/how-to-add-prisoners$/)
  }

  const validateAnswersArePersisted = () => {
    cy.go('back')
    cy.reload()
    getDescriptionInput().should('have.value', `<script>alert('xss-description');</script>`)
  }
})
