import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /update-reference-data/select-alert-type screen', () => {
  let uuid = uuidV4()

  const getContinueButton = () => cy.findByRole('button', { name: /Continue/ })
  const getAlertTypeRadio1 = () => cy.findByRole('radio', { name: /AA \(A description\)$/ })
  const getAlertTypeRadio2 = () => cy.findByRole('radio', { name: /DB \(DB description\)$/ })
  const getAlertTypeRadio3 = () => cy.findByRole('radio', { name: /DE \(Deactivated Type\) Deactivated$/ })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubGetAlertTypes')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
  })

  it('should try out ALERT_TYPE EDIT_DESCRIPTION cases', () => {
    navigateToTestPage('ALERT_TYPE', 'EDIT_DESCRIPTION')
    cy.url().should('to.match', /\/update-reference-data\/select-alert-type$/)
    validatePageContents()

    getAlertTypeRadio1().should('exist')
    getAlertTypeRadio2().should('exist')
    getAlertTypeRadio3().should('exist')

    getContinueButton().click()
    cy.findByRole('link', { name: /You must select an alert type$/i })
      .should('be.visible')
      .click()
    getAlertTypeRadio1().should('be.focused')

    getAlertTypeRadio1().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/update-reference-data\/edit-alert-type$/)
    cy.go('back')
    cy.reload()
    getAlertTypeRadio1().should('be.checked')
  })

  it('should try out ALERT_TYPE DEACTIVATE cases', () => {
    uuid = uuidV4()
    navigateToTestPage('ALERT_TYPE', 'DEACTIVATE')
    cy.url().should('to.match', /\/update-reference-data\/select-alert-type$/)
    validatePageContents()

    getAlertTypeRadio1().should('exist')
    getAlertTypeRadio2().should('exist')
    getAlertTypeRadio3().should('not.exist')

    getAlertTypeRadio1().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/update-reference-data\/deactivate-alert-type$/)
  })

  it('should try out ALERT_TYPE REACTIVATE cases', () => {
    uuid = uuidV4()
    navigateToTestPage('ALERT_TYPE', 'REACTIVATE')
    cy.url().should('to.match', /\/update-reference-data\/select-alert-type$/)
    validatePageContents()

    getAlertTypeRadio1().should('not.exist')
    getAlertTypeRadio2().should('not.exist')
    getAlertTypeRadio3().should('exist')

    getAlertTypeRadio3().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/update-reference-data\/check-answers$/)
  })

  it('should try out ALERT_CODE ADD_NEW cases', () => {
    uuid = uuidV4()
    navigateToTestPage('ALERT_CODE', 'ADD_NEW')
    cy.url().should('to.match', /\/update-reference-data\/select-alert-type$/)
    validatePageContents()

    getAlertTypeRadio1().should('exist')
    getAlertTypeRadio2().should('exist')
    getAlertTypeRadio3().should('exist')

    getAlertTypeRadio1().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/update-reference-data\/add-alert-code$/)
  })

  it('should try out ALERT_CODE EDIT_DESCRIPTION cases', () => {
    uuid = uuidV4()
    navigateToTestPage('ALERT_CODE', 'EDIT_DESCRIPTION')
    cy.url().should('to.match', /\/update-reference-data\/select-alert-type$/)
    validatePageContents()

    getAlertTypeRadio1().should('exist')
    getAlertTypeRadio2().should('exist')
    getAlertTypeRadio3().should('not.exist')

    getAlertTypeRadio1().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/update-reference-data\/select-alert-code$/)
  })

  it('should try out ALERT_CODE DEACTIVATE cases', () => {
    uuid = uuidV4()
    navigateToTestPage('ALERT_CODE', 'DEACTIVATE')
    cy.url().should('to.match', /\/update-reference-data\/select-alert-type$/)
    validatePageContents()

    getAlertTypeRadio1().should('not.exist')
    getAlertTypeRadio2().should('exist')
    getAlertTypeRadio3().should('not.exist')

    getAlertTypeRadio2().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/update-reference-data\/select-alert-code$/)
  })

  it('should try out ALERT_CODE REACTIVATE cases', () => {
    uuid = uuidV4()
    navigateToTestPage('ALERT_CODE', 'REACTIVATE')
    cy.url().should('to.match', /\/update-reference-data\/select-alert-type$/)
    validatePageContents()

    getAlertTypeRadio1().should('exist')
    getAlertTypeRadio2().should('not.exist')
    getAlertTypeRadio3().should('not.exist')

    getAlertTypeRadio1().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/update-reference-data\/select-alert-code$/)
  })

  const navigateToTestPage = (
    referenceDataType: 'ALERT_TYPE' | 'ALERT_CODE',
    changeType: 'ADD_NEW' | 'EDIT_DESCRIPTION' | 'DEACTIVATE' | 'REACTIVATE',
  ) => {
    cy.signIn()
    cy.visit(`/${uuid}/update-reference-data`, { failOnStatusCode: false })
    injectJourneyDataAndReload(uuid, {
      updateRefData: { referenceDataType, changeType },
    })
    cy.visit(`/${uuid}/update-reference-data/select-alert-type`, { failOnStatusCode: false })
  }

  const validatePageContents = () => {
    cy.title().should('match', /Select an alert type - Maintain alerts reference data - DPS/)
    cy.findByRole('heading', {
      name: /Select an alert type/,
    }).should('be.visible')
    getContinueButton().should('be.visible')
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /select-change$/)
  }
})
