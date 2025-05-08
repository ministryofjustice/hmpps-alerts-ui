import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /update-reference-data/select-change screen', () => {
  let uuid = uuidV4()

  const getContinueButton = () => cy.findByRole('button', { name: /Continue/ })
  const getAlertTypeRadio1 = () => cy.findByRole('radio', { name: /Add new alert type$/ })
  const getAlertTypeRadio2 = () => cy.findByRole('radio', { name: /Edit alert type description$/ })
  const getAlertTypeRadio3 = () => cy.findByRole('radio', { name: /Deactivate alert type$/ })
  const getAlertTypeRadio4 = () => cy.findByRole('radio', { name: /Reactivate alert type$/ })
  const getAlertCodeRadio1 = () => cy.findByRole('radio', { name: /Add new alert$/ })
  const getAlertCodeRadio2 = () => cy.findByRole('radio', { name: /Edit alert description$/ })
  const getAlertCodeRadio3 = () => cy.findByRole('radio', { name: /Deactivate alert$/ })
  const getAlertCodeRadio4 = () => cy.findByRole('radio', { name: /Reactivate alert$/ })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubGetAlertTypes')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
  })

  it('should try out ALERT_TYPE cases', () => {
    navigateToTestPage('ALERT_TYPE')
    cy.url().should('to.match', /\/update-reference-data\/select-change$/)
    validatePageContents()

    getAlertTypeRadio1().should('exist')
    getAlertTypeRadio2().should('exist')
    getAlertTypeRadio3().should('exist')
    getAlertTypeRadio4().should('exist')

    getContinueButton().click()
    cy.findByRole('link', { name: /Select the change you want to make$/i })
      .should('be.visible')
      .click()
    getAlertTypeRadio1().should('be.focused')

    getAlertTypeRadio1().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/update-reference-data\/add-alert-type$/)
    cy.go('back')
    cy.reload()
    getAlertTypeRadio1().should('be.checked')
  })

  it('should try out ALERT_CODE cases', () => {
    uuid = uuidV4()
    navigateToTestPage('ALERT_CODE')
    cy.url().should('to.match', /\/update-reference-data\/select-change$/)
    validatePageContents()

    getAlertCodeRadio1().should('exist')
    getAlertCodeRadio2().should('exist')
    getAlertCodeRadio3().should('exist')
    getAlertCodeRadio4().should('exist')

    getContinueButton().click()
    cy.findByRole('link', { name: /Select the change you want to make$/i })
      .should('be.visible')
      .click()
    getAlertCodeRadio1().should('be.focused')

    getAlertCodeRadio1().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/update-reference-data\/select-alert-type$/)
    cy.go('back')
    cy.reload()
    getAlertCodeRadio1().should('be.checked')
  })

  const navigateToTestPage = (referenceDataType: 'ALERT_TYPE' | 'ALERT_CODE') => {
    cy.signIn()
    cy.visit(`/${uuid}/update-reference-data`, { failOnStatusCode: false })
    injectJourneyDataAndReload(uuid, {
      updateRefData: { referenceDataType },
    })
    cy.visit(`/${uuid}/update-reference-data/select-change`, { failOnStatusCode: false })
  }

  const validatePageContents = () => {
    cy.title().should('match', /Select the change you want to make - Maintain alerts reference data - DPS/)
    cy.findByRole('heading', {
      name: /Select the change you want to make/,
    }).should('be.visible')
    getContinueButton().should('be.visible')
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /..\/update-reference-data$/)
  }
})
