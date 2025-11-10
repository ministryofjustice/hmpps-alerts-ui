import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'
import { ManageAlertRestrictionsJourney } from '../../../../@types/express'

context('test /manage-alert-restrictions/confirmation', () => {
  let uuid = uuidV4()

  const defaultJourneyData: ManageAlertRestrictionsJourney = {
    alertType: {
      code: 'AA',
      description: 'AA description',
      isActive: true,
      listSequence: 1,
      createdAt: '',
      createdBy: '',
    },
    alertCode: {
      code: 'BB',
      alertTypeCode: 'AA',
      description: 'BB description',
      isActive: true,
      isRestricted: false,
      listSequence: 1,
      createdAt: '',
      createdBy: '',
    },
    code: 'BB',
  }

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_DPS_APPLICATION_DEVELOPER],
    })
  })

  it('should show RESTRICT_ALERT confirmation page', () => {
    uuid = uuidV4()
    navigateToTestPage({
      ...defaultJourneyData,
      changeType: 'RESTRICT_ALERT',
    })
    cy.url().should('to.match', /\/confirmation$/)
    cy.checkAxeAccessibility()
    cy.title().should('equal', 'Alert restricted - DPS')
    cy.findByText('Alert restricted').should('be.visible')
    cy.findByText('You have restricted the BB (BB description) alert.').should('be.visible')

    validateCommonPageContents()
  })

  it('should show REMOVE_ALERT_RESTRICTION confirmation page', () => {
    uuid = uuidV4()
    navigateToTestPage({
      ...defaultJourneyData,
      changeType: 'REMOVE_ALERT_RESTRICTION',
    })
    cy.url().should('to.match', /\/confirmation$/)
    cy.checkAxeAccessibility()
    cy.title().should('equal', 'Alert restriction removed - DPS')
    cy.findByText('Alert restriction removed').should('be.visible')
    cy.findByText('You have removed the restriction from the BB (BB description) alert.').should('be.visible')

    validateCommonPageContents()
  })

  it('should show ADD_PRIVILEGED_USER confirmation page', () => {
    uuid = uuidV4()
    navigateToTestPage({
      ...defaultJourneyData,
      changeType: 'ADD_PRIVILEGED_USER',
      username: 'TEST_USER',
    })
    cy.url().should('to.match', /\/confirmation$/)
    cy.checkAxeAccessibility()
    cy.title().should('equal', 'Privileged user added - DPS')
    cy.findByText('Privileged user added').should('be.visible')
    cy.findByText('You have added TEST_USER as a privileged user to the BB (BB description) alert.').should(
      'be.visible',
    )

    validateCommonPageContents()
  })

  it('should show REMOVE_PRIVILEGED_USER confirmation page', () => {
    uuid = uuidV4()
    navigateToTestPage({
      ...defaultJourneyData,
      changeType: 'REMOVE_PRIVILEGED_USER',
      username: 'TEST_USER',
    })
    cy.url().should('to.match', /\/confirmation$/)
    cy.checkAxeAccessibility()
    cy.title().should('equal', 'Privileged user removed - DPS')
    cy.findByText('Privileged user removed').should('be.visible')
    cy.findByText('You have removed TEST_USER as a privileged user from the BB (BB description) alert.').should(
      'be.visible',
    )

    validateCommonPageContents()
  })

  const validateCommonPageContents = () => {
    cy.findByRole('button', { name: 'Return to manage prisoner alerts' })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('equal', '/')
  }

  const navigateToTestPage = (journeyData: ManageAlertRestrictionsJourney) => {
    cy.signIn()
    cy.visit(`/${uuid}/manage-alert-restrictions`, { failOnStatusCode: false })
    injectJourneyDataAndReload(uuid, {
      restrictAlert: journeyData,
    })
    cy.visit(`/${uuid}/manage-alert-restrictions/confirmation`)
  }
})
