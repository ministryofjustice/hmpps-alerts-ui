import AuthorisedRoles from '../../../authentication/authorisedRoles'

context('test /bulk-alerts full journey', () => {
  const getContinueButton = () => cy.findByRole('button', { name: /Continue/ })

  const getAlertTypeInput = () => cy.findByRole('combobox', { name: /Type of alert/ })
  const getAlertCodeInput = () => cy.findByRole('combobox', { name: /^Alert$/ })

  const getDescriptionInput = () => cy.findByRole('textbox', { name: /Enter why you are creating this alert$/ })

  const getQueryInput = () => cy.findByRole('textbox', { name: /Who should have the ‘OCG Nominal’ alert applied\?/ })
  const getSearchButton = () => cy.findByRole('button', { name: /^Search$/ })

  const getChooseFile = () => cy.get('input[type="file"]')
  const getUploadButton = () => cy.findByRole('button', { name: /^Upload file$/ })

  const getLogicRadio1 = () =>
    cy.findByRole('radio', {
      name: /Add new alerts from the list without deactivating any existing ‘OCG Nominal’ alerts/,
    })
  const getLogicRadio2 = () =>
    cy.findByRole('radio', { name: /Deactivate ‘OCG Nominal’ alerts for anyone not on the list/ })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubGetAlertTypes')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS],
    })
    cy.task('stubPostPrisonerSearchOneFound')
    cy.task('stubPostPrisonerSearchByNumber')
    cy.task('stubPlanBulkAlerts')
    cy.task('stubCreateBulkAlerts')
  })

  it('create bulk alerts - happy path', () => {
    cy.signIn()
    cy.visit('/bulk-alerts', { failOnStatusCode: false })

    // /bulk-alerts
    getAlertTypeInput().select('DB description')
    getAlertCodeInput().select('OCG Nominal')
    getContinueButton().click()

    // /bulk-alerts/how-to-add-prisoners
    cy.findByRole('radio', { name: /Search for them one by one/ }).click()
    getContinueButton().click()

    // /bulk-alerts/select-prisoner
    getQueryInput().type('A1111AA', { delay: 0 })
    getSearchButton().click()
    getContinueButton().click()

    // /bulk-alerts/review-prisoners
    cy.url().should('to.match', /\/bulk-alerts\/review-prisoners$/)
    cy.findAllByRole('button', { name: /^Continue$/ })
      .first()
      .click()

    // /bulk-alerts/select-upload-logic
    getLogicRadio1().click()
    getContinueButton().click()

    // /bulk-alerts/check-answers
    validateCheckAnswersChangeLink()

    cy.findByRole('button', { name: /Confirm and upload alerts/i }).click()
    cy.url().should('to.match', /\/confirmation(#[A-z]+)?$/)

    // validate that user will be redirected to confirmation screen if trying to go back
    cy.go('back')
    cy.url().should('to.match', /\/confirmation(#[A-z]+)?$/)
  })

  const validateCheckAnswersChangeLink = () => {
    // Change upload logic
    cy.contains('dt', 'Upload logic')
      .next()
      .should('include.text', 'Add new alerts from the list without deactivating any existing ‘OCG Nominal’ alerts')

    cy.findByRole('link', { name: /Change the upload logic/i }).click()
    getLogicRadio2().click()
    getContinueButton().click()

    cy.contains('dt', 'Upload logic')
      .next()
      .should('include.text', 'Deactivate ‘OCG Nominal’ alerts for anyone not on the list')

    // Change prisoner list
    cy.findByRole('link', { name: /Change the selected prisoners/i }).click()
    cy.findByRole('link', { name: /Remove prison number A1111AA/ }).click()
    cy.findByRole('button', { name: /^Add someone to the list$/ }).click()
    cy.findByRole('radio', { name: /Add a group of people using a CSV file/ }).click()
    getContinueButton().click()
    getChooseFile().attachFile({
      fileContent: new Blob(['Prison number\nA1111AA']),
      fileName: 'test.csv',
      mimeType: 'text/csv',
    })
    getUploadButton().click()
    cy.url().should('to.match', /\/bulk-alerts\/review-prisoners$/)
    cy.findAllByRole('button', { name: /^Continue$/ })
      .first()
      .click()
    getLogicRadio2().click()
    getContinueButton().click()

    // Change from OCG Nominal alert to other type
    cy.contains('dt', 'Alert').next().should('include.text', 'OCG Nominal')

    cy.findByRole('link', { name: /Change the alert to be created/i }).click()
    getAlertCodeInput().select('AA description')
    getContinueButton().click()

    getDescriptionInput().clear().type(`Reason A`, { delay: 0 })
    getContinueButton().click()

    cy.contains('dt', 'Alert').next().should('include.text', 'AA description')

    // Change description
    cy.contains('dt', 'Reason for alert').next().should('include.text', 'Reason A')

    cy.findByRole('link', { name: /Change the reason for alert/i }).click()
    getDescriptionInput().clear().type(`Reason B`, { delay: 0 })
    getContinueButton().click()

    cy.contains('dt', 'Reason for alert').next().should('include.text', 'Reason B')

    // Change from other type to OCG Nominal alert
    cy.findByRole('link', { name: /Change the alert to be created/i }).click()
    getAlertCodeInput().select('OCG Nominal')
    getContinueButton().click()
    cy.contains('dt', 'Alert').next().should('include.text', 'OCG Nominal')
    cy.contains('dt', 'Reason for alert')
      .next()
      .should(
        'include.text',
        '** Offenders must not be made aware of the OCG flag status.  Do not Share with offender. **',
      )
  }
})
