import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /manage-alert-restrictions/select-alert-code screen', () => {
  let uuid = uuidV4()

  const getContinueButton = () => cy.findByRole('button', { name: /Continue/ })
  const getAlertCodeRadio1 = () => cy.findByRole('radio', { name: /AA \(AA description\)$/ })
  const getAlertCodeRadio2 = () => cy.findByRole('radio', { name: /DOCGM \(OCG Nominal\)$/ })
  const getRestrictedActiveAlertRadio = () =>
    cy.findByRole('radio', { name: /XXA \(Restricted active alert\) Restricted$/ })
  const getRestrictedInactiveAlertRadio = () =>
    cy.findByRole('radio', { name: /XXB \(Restricted inactive alert\) Deactivated Restricted$/ })

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
    uuid = uuidV4()
    navigateToTestPage('RESTRICT_ALERT')
    cy.url().should('to.match', /\/manage-alert-restrictions\/select-alert-code$/)
    cy.checkAxeAccessibility()
    validatePageContents('Select an alert code')

    getAlertCodeRadio1().should('exist')
    getAlertCodeRadio2().should('exist')

    getContinueButton().click()
    cy.findByRole('link', { name: /You must select an alert$/i })
      .should('be.visible')
      .click()
    getAlertCodeRadio1().should('be.focused')

    getAlertCodeRadio1().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/manage-alert-restrictions\/check-answers$/)

    cy.go('back')
    cy.reload()
    getAlertCodeRadio1().should('be.checked')
  })

  it('should try out REMOVE_ALERT_RESTRICTION cases', () => {
    uuid = uuidV4()
    navigateToTestPage('REMOVE_ALERT_RESTRICTION')
    cy.url().should('to.match', /\/manage-alert-restrictions\/select-alert-code$/)
    cy.checkAxeAccessibility()
    validatePageContents('Select an alert code')

    getRestrictedActiveAlertRadio().should('exist')
    getRestrictedInactiveAlertRadio().should('exist')

    getRestrictedActiveAlertRadio().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/manage-alert-restrictions\/check-answers$/)

    cy.go('back')
    cy.reload()
    getRestrictedActiveAlertRadio().should('be.checked')
  })

  it('should try out ADD_PRIVILEGED_USER cases', () => {
    uuid = uuidV4()
    navigateToTestPage('ADD_PRIVILEGED_USER')
    cy.url().should('to.match', /\/manage-alert-restrictions\/select-alert-code$/)
    cy.checkAxeAccessibility()
    validatePageContents('Select an alert code')

    getAlertCodeRadio1().should('exist')
    getAlertCodeRadio2().should('exist')

    getAlertCodeRadio1().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/manage-alert-restrictions\/select-user$/)

    cy.go('back')
    cy.reload()
    getAlertCodeRadio1().should('be.checked')
  })

  it('should try out REMOVE_PRIVILEGED_USER cases', () => {
    uuid = uuidV4()
    navigateToTestPage('REMOVE_PRIVILEGED_USER')
    cy.url().should('to.match', /\/manage-alert-restrictions\/select-alert-code$/)
    cy.checkAxeAccessibility()
    validatePageContents('Select an alert code')

    getAlertCodeRadio1().should('exist')
    getAlertCodeRadio2().should('exist')

    getAlertCodeRadio1().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/manage-alert-restrictions\/select-user$/)

    cy.go('back')
    cy.reload()
    getAlertCodeRadio1().should('be.checked')
  })

  const navigateToTestPage = (
    changeType: 'RESTRICT_ALERT' | 'REMOVE_ALERT_RESTRICTION' | 'ADD_PRIVILEGED_USER' | 'REMOVE_PRIVILEGED_USER',
  ) => {
    cy.signIn()
    cy.visit(`/${uuid}/manage-alert-restrictions`, { failOnStatusCode: false })
    const alertType =
      changeType === 'REMOVE_ALERT_RESTRICTION'
        ? {
            code: 'XX',
            description: 'Restricted Type',
            isActive: true,
          }
        : {
            code: 'DB',
            description: 'DB description',
            isActive: true,
          }
    injectJourneyDataAndReload(uuid, {
      restrictAlert: { changeType, alertType },
    })
    cy.visit(`/${uuid}/manage-alert-restrictions/select-alert-code`, { failOnStatusCode: false })
  }

  const validatePageContents = (heading: string) => {
    cy.title().should('equal', `${heading} - Manage alert restrictions - DPS`)
    cy.findByRole('heading', {
      name: heading,
    }).should('be.visible')
    getContinueButton().should('be.visible')
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /select-alert-type$/)
  }
})
