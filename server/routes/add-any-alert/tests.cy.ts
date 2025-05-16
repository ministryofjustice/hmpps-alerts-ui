import AuthorisedRoles from '../../authentication/authorisedRoles'
import { todayStringGBFormat } from '../../utils/datetimeUtils'

context('test /add-any-alert screen', () => {
  const getContinueButton = () => cy.findByRole('button', { name: /Add alert/ })
  const getPrisonNumberInput = () => cy.findByRole('textbox', { name: 'Enter prison number' })
  const getAlertTypeInput = () => cy.findByRole('combobox', { name: /Type of alert/ })
  const getAlertCodeInput = () => cy.findByRole('combobox', { name: /^Alert$/ })
  const getDescriptionInput = () => cy.findByRole('textbox', { name: /Why are you creating this alert\?/ })
  const getDateFromInput = () => cy.findByRole('textbox', { name: /Alert start date/ })
  const getDateToInput = () => cy.findByRole('textbox', { name: /Alert end date \(optional\)/ })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubGetAlertTypes')
  })

  it('create an alert - happy path', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS],
    })

    cy.task('stubGetPrisoner')
    cy.task('stubGetPrisonerAlertsNotFound')
    cy.task('stubCreateAlert')

    navigateToTestPage()
    cy.url().should('to.match', /add-any-alert$/)
    cy.checkAxeAccessibility()
    validatePageContents()

    getPrisonNumberInput().type('A1234BC', { delay: 0 })
    getAlertTypeInput().select('DB description')
    getAlertCodeInput().select('AA description')
    getDescriptionInput().type('description', { delay: 0 })
    getDateFromInput().should('have.value', todayStringGBFormat())
    getContinueButton().click()

    cy.url().should('to.match', /add-any-alert\?alertType=DB&alertCode=AA$/)
    getAlertTypeInput().should('have.value', 'DB')
    getAlertCodeInput().should('have.value', 'AA')
    cy.findByText('You’ve created a ‘AA description’ alert for Testname User').should('be.visible')
  })

  it('shows unauthorised message if user does not have BULK_PRISON_ESTATE_ALERTS role', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
    navigateToTestPage()
    cy.url().should('to.match', /add-any-alert$/)
    cy.findByText('You are not authorised to use this application.').should('be.visible')
    cy.findByRole('heading', { name: /Add an alert/i }).should('not.exist')
  })

  it('shows validation errors', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS],
    })

    navigateToTestPage()

    getPrisonNumberInput().type('WRONG_FORMAT', { delay: 0 })
    getDateToInput().type('01/01/1999', { delay: 0 })
    getContinueButton().click()

    cy.findByRole('link', { name: /Enter a prison number in the format A1234CD/i })
      .should('be.visible')
      .click()
    getPrisonNumberInput().should('be.focused')
    cy.findByRole('link', { name: /Select the alert type/i })
      .should('be.visible')
      .click()
    getAlertTypeInput().should('be.focused')
    cy.findByRole('link', { name: /Select the alert$/i })
      .should('be.visible')
      .click()
    getAlertCodeInput().should('be.focused')
    cy.findByRole('link', { name: /Enter why you are creating this alert/i })
      .should('be.visible')
      .click()
    getDescriptionInput().should('be.focused')
    cy.findByRole('link', { name: /The alert end date must be after the alert start date/i })
      .should('be.visible')
      .click()
    getDateToInput().should('be.focused')

    getDescriptionInput().type('n'.repeat(1001), { delay: 0 })
    getDateFromInput().clear()
    getContinueButton().click()

    cy.findByRole('link', { name: /The reason for creating this alert must be 1,000 characters or under/i })
      .should('be.visible')
      .click()
    getDescriptionInput().should('be.focused')
    cy.findByRole('link', { name: /Enter the alert start date/i })
      .should('be.visible')
      .click()
    getDateFromInput().should('be.focused')
  })

  it('shows error if no prisoner found for prison number', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS],
    })
    cy.task('stubGetPrisoner500')

    navigateToTestPage('DB', 'AA')

    getPrisonNumberInput().type('A1234BC', { delay: 0 })
    getDescriptionInput().type('description', { delay: 0 })
    getContinueButton().click()

    cy.findByRole('link', { name: /The prison number ‘A1234BC’ was not recognised/i })
      .should('be.visible')
      .click()
    getPrisonNumberInput().should('be.focused')
  })

  it('shows error if prisoner has an active alert of the same code', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS],
    })
    cy.task('stubGetPrisoner')
    cy.task('stubGetPrisonerAlertsFound')

    navigateToTestPage('DB', 'AA')

    getPrisonNumberInput().type('A1234BC', { delay: 0 })
    getDescriptionInput().type('description', { delay: 0 })
    getContinueButton().click()

    cy.findByRole('link', { name: /Testname User already has the ‘AA description’ alert active/i })
      .should('be.visible')
      .click()
    getAlertCodeInput().should('be.focused')
  })

  const navigateToTestPage = (alertType?: string, alertCode?: string) => {
    const queries = []
    if (alertType) {
      queries.push(`alertType=${alertType}`)
    }
    if (alertCode) {
      queries.push(`alertCode=${alertCode}`)
    }
    let url = `/add-any-alert`
    if (queries.length) {
      url += `?${queries.join('&')}`
    }
    cy.signIn()
    cy.visit(url, { failOnStatusCode: false })
  }

  const validatePageContents = () => {
    cy.findByRole('heading', { name: /Add an alert/i }).should('be.visible')
    getContinueButton().should('be.visible')
    getPrisonNumberInput().should('be.visible')
    getAlertTypeInput().should('be.visible')
    getAlertCodeInput().should('be.visible')
    getDescriptionInput().should('be.visible')
    getDateFromInput().should('be.visible')
    getDateToInput().should('be.visible')
  }
})
