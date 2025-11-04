import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /manage-alert-restrictions/select-alert-type screen', () => {
  let uuid = uuidV4()

  const getContinueButton = () => cy.findByRole('button', { name: /Continue/ })
  const getAlertTypeRadio1 = () => cy.findByRole('radio', { name: /AA \(A description\)$/ })
  const getAlertTypeRadio2 = () => cy.findByRole('radio', { name: /DB \(DB description\)$/ })
  const getDeactivatedAlertTypeRadio = () => cy.findByRole('radio', { name: /DE \(Deactivated Type\) Deactivated$/ })
  const getRestrictedAlertTypeRadio = () => cy.findByRole('radio', { name: /XX \(Restricted Type\)$/ })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubGetAlertTypes')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_DPS_APPLICATION_DEVELOPER],
    })
  })

  it('should require the DPS_APPLICATION_DEVELOPER role to view the page', () => {
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
    navigateToTestPage('RESTRICT_ALERT')
    cy.findByRole('heading', { name: /Authorisation Error/ }).should('be.visible')
  })

  it('should try out RESTRICT_ALERT cases', () => {
    navigateToTestPage('RESTRICT_ALERT')
    cy.url().should('to.match', /\/manage-alert-restrictions\/select-alert-type$/)
    cy.checkAxeAccessibility()
    validatePageContents()

    getAlertTypeRadio1().should('exist')
    getAlertTypeRadio2().should('exist')
    getDeactivatedAlertTypeRadio().should('not.exist')
    getRestrictedAlertTypeRadio().should('not.exist')

    getContinueButton().click()
    cy.findByRole('link', { name: /You must select an alert type$/i })
      .should('be.visible')
      .click()
    getAlertTypeRadio1().should('be.focused')

    getAlertTypeRadio1().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/manage-alert-restrictions\/select-alert-code$/)
    cy.go('back')
    cy.reload()
    getAlertTypeRadio1().should('be.checked')
  })

  it('should try out REMOVE_ALERT_RESTRICTION cases', () => {
    uuid = uuidV4()
    navigateToTestPage('REMOVE_ALERT_RESTRICTION')
    cy.url().should('to.match', /\/manage-alert-restrictions\/select-alert-type$/)
    cy.checkAxeAccessibility()
    validatePageContents()

    getAlertTypeRadio1().should('not.exist')
    getAlertTypeRadio2().should('not.exist')
    getDeactivatedAlertTypeRadio().should('not.exist')
    getRestrictedAlertTypeRadio().should('exist')

    getRestrictedAlertTypeRadio().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/manage-alert-restrictions\/select-alert-code$/)
  })

  it('should try out ADD_PRIVILEGED_USER cases', () => {
    uuid = uuidV4()
    navigateToTestPage('ADD_PRIVILEGED_USER')
    cy.url().should('to.match', /\/manage-alert-restrictions\/select-alert-type$/)
    cy.checkAxeAccessibility()
    validatePageContents()

    getAlertTypeRadio1().should('exist')
    getAlertTypeRadio2().should('exist')
    getDeactivatedAlertTypeRadio().should('not.exist')
    getRestrictedAlertTypeRadio().should('exist')

    getAlertTypeRadio1().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/manage-alert-restrictions\/select-alert-code$/)
  })

  it('should try out REMOVE_PRIVILEGED_USER cases', () => {
    uuid = uuidV4()
    navigateToTestPage('REMOVE_PRIVILEGED_USER')
    cy.url().should('to.match', /\/manage-alert-restrictions\/select-alert-type$/)
    cy.checkAxeAccessibility()
    validatePageContents()

    getAlertTypeRadio1().should('exist')
    getAlertTypeRadio2().should('exist')
    getDeactivatedAlertTypeRadio().should('not.exist')
    getRestrictedAlertTypeRadio().should('exist')

    getAlertTypeRadio1().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/manage-alert-restrictions\/select-alert-code$/)
  })

  const navigateToTestPage = (
    changeType: 'RESTRICT_ALERT' | 'REMOVE_ALERT_RESTRICTION' | 'ADD_PRIVILEGED_USER' | 'REMOVE_PRIVILEGED_USER',
  ) => {
    cy.signIn()
    cy.visit(`/${uuid}/manage-alert-restrictions`, { failOnStatusCode: false })
    injectJourneyDataAndReload(uuid, {
      restrictAlert: { changeType },
    })
    cy.visit(`/${uuid}/manage-alert-restrictions/select-alert-type`, { failOnStatusCode: false })
  }

  const validatePageContents = () => {
    cy.title().should('match', /Select an alert type - Manage alert restrictions - DPS/)
    cy.findByRole('heading', {
      name: /Select an alert type/,
    }).should('be.visible')
    getContinueButton().should('be.visible')
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /manage-alert-restrictions$/)
  }
})
