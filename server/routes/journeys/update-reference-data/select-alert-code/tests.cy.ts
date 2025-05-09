import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'
import { AlertType } from '../../../../@types/alerts/alertsApiTypes'

context('test /update-reference-data/select-alert-code screen', () => {
  let uuid = uuidV4()

  const getContinueButton = () => cy.findByRole('button', { name: /Continue/ })
  const getAlertCodeRadio1 = () => cy.findByRole('radio', { name: /AA \(AA description\)$/ })
  const getAlertCodeRadio2 = () => cy.findByRole('radio', { name: /DOCGM \(OCG Nominal\)$/ })
  const getAlertCodeRadio3 = () => cy.findByRole('radio', { name: /BB \(BB description\) Deactivated$/ })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubGetAlertTypes')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
  })

  it('should try out ALERT_CODE EDIT_DESCRIPTION cases', () => {
    uuid = uuidV4()
    navigateToTestPage('EDIT_DESCRIPTION')
    cy.url().should('to.match', /\/update-reference-data\/select-alert-code$/)
    validatePageContents('Select an alert to edit')

    getAlertCodeRadio1().should('exist')
    getAlertCodeRadio2().should('exist')

    getContinueButton().click()
    cy.findByRole('link', { name: /You must select an alert$/i })
      .should('be.visible')
      .click()
    getAlertCodeRadio1().should('be.focused')

    getAlertCodeRadio1().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/update-reference-data\/edit-alert-code$/)
  })

  it('should try out ALERT_CODE DEACTIVATE cases', () => {
    uuid = uuidV4()
    navigateToTestPage('DEACTIVATE')
    cy.url().should('to.match', /\/update-reference-data\/select-alert-code$/)
    validatePageContents('Select an alert to deactivate')

    getAlertCodeRadio1().should('exist')
    getAlertCodeRadio2().should('exist')

    getAlertCodeRadio1().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/update-reference-data\/deactivate-alert-code$/)
  })

  it('should try out ALERT_CODE REACTIVATE cases', () => {
    uuid = uuidV4()
    navigateToTestPage('REACTIVATE')
    cy.url().should('to.match', /\/update-reference-data\/select-alert-code$/)
    validatePageContents('Select an alert to reactivate')

    getAlertCodeRadio3().should('exist')

    getAlertCodeRadio3().click()
    getContinueButton().click()
    cy.url().should('to.match', /\/update-reference-data\/check-answers$/)
  })

  const navigateToTestPage = (changeType: 'EDIT_DESCRIPTION' | 'DEACTIVATE' | 'REACTIVATE') => {
    cy.signIn()
    cy.visit(`/${uuid}/update-reference-data`, { failOnStatusCode: false })
    const alertType =
      changeType === 'REACTIVATE'
        ? {
            code: 'AA',
            description: 'A description',
            isActive: true,
          }
        : {
            code: 'DB',
            description: 'DB description',
            isActive: true,
          }
    injectJourneyDataAndReload(uuid, {
      updateRefData: {
        referenceDataType: 'ALERT_CODE',
        changeType,
        updateAlertCodeSubJourney: { alertType: alertType as AlertType },
      },
    })
    cy.visit(`/${uuid}/update-reference-data/select-alert-code`, { failOnStatusCode: false })
  }

  const validatePageContents = (heading: string) => {
    cy.title().should('equal', `${heading} - Maintain alerts reference data - DPS`)
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
