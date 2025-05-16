import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /update-reference-data/deactivate-alert-code', () => {
  const getContinueButton = () => cy.findByRole('button', { name: /Confirm and save/ })
  const getYesRadio = () => cy.findByRole('radio', { name: /Yes$/ })
  const getNoRadio = () => cy.findByRole('radio', { name: /No$/ })

  let uuid = uuidV4()

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubDeactivateAlertCode')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
  })

  it('should confirm to deactivate Alert Code', () => {
    uuid = uuidV4()
    navigateToTestPage()
    cy.url().should('to.match', /\/deactivate-alert-code$/)
    cy.checkAxeAccessibility()

    cy.title().should('equal', 'Are you sure you want to deactivate the alert? - Maintain alerts reference data - DPS')
    cy.findByRole('heading', { name: 'Are you sure you want to deactivate the AA (Code Name) alert?' }).should(
      'be.visible',
    )

    getYesRadio().should('exist')
    getNoRadio().should('exist')

    getContinueButton().should('be.visible').click()

    cy.findByRole('link', { name: /Select whether you want to deactivate the alert$/i })
      .should('be.visible')
      .click()
    getYesRadio().should('be.focused')

    getYesRadio().click()
    getContinueButton().click()

    cy.url().should('to.match', /\/confirmation(#[A-z]+)?$/)
  })

  it('should cancel deactivating Alert Code and return to homepage', () => {
    uuid = uuidV4()
    navigateToTestPage()
    cy.url().should('to.match', /\/deactivate-alert-code$/)

    cy.title().should('equal', 'Are you sure you want to deactivate the alert? - Maintain alerts reference data - DPS')
    cy.findByRole('heading', { name: 'Are you sure you want to deactivate the AA (Code Name) alert?' }).should(
      'be.visible',
    )

    getNoRadio().click()
    getContinueButton().click()

    cy.findByRole('heading', { name: 'Manage prisoner alerts' }).should('be.visible')
  })

  const navigateToTestPage = () => {
    cy.signIn()
    cy.visit(`/${uuid}/update-reference-data`, { failOnStatusCode: false })
    injectJourneyDataAndReload(uuid, {
      updateRefData: {
        referenceDataType: 'ALERT_CODE',
        changeType: 'DEACTIVATE',
        alertType: {
          code: 'AB',
          description: 'Type Name',
          isActive: true,
          listSequence: 0,
          createdAt: '',
          createdBy: '',
        },
        alertCode: {
          code: 'AA',
          description: 'Code Name',
          isActive: true,
          listSequence: 0,
          createdAt: '',
          createdBy: '',
          alertTypeCode: 'AB',
        },
      },
    })
    cy.visit(`/${uuid}/update-reference-data/deactivate-alert-code`)
  }
})
