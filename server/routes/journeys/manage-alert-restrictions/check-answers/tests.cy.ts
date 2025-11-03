import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'
import { ManageAlertRestrictionsJourney } from '../../../../@types/express'

context('test /manage-alert-restrictions/check-answers', () => {
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
    cy.task('stubRestrictAlertCode')
    cy.task('stubRemoveAlertCodeRestriction')
    cy.task('stubAddPrivilegedUser')
    cy.task('stubRemovePrivilegedUser')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_DPS_APPLICATION_DEVELOPER],
    })
  })

  it('should check answers for Restrict Alert', () => {
    uuid = uuidV4()
    navigateToTestPage({
      ...defaultJourneyData,
      changeType: 'RESTRICT_ALERT',
    })
    cy.url().should('to.match', /\/check-answers$/)
    cy.checkAxeAccessibility()

    cy.title().should('equal', 'Check your changes - Manage alert restrictions - DPS')
    cy.findByRole('heading', { name: /Check your changes/ }).should('be.visible')

    cy.contains('dt', 'Alert type').next().should('include.text', 'AA (AA description)')
    cy.contains('dt', 'Alert to restrict').next().should('include.text', 'BB (BB description)')

    cy.findByRole('link', { name: /Change the alert type/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /select-alert-type$/)

    cy.findByRole('link', { name: /Change the alert to restrict/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /select-alert-code$/)

    continueToConfirmation()
  })

  it('should check answers for Remove Alert Restriction', () => {
    uuid = uuidV4()
    navigateToTestPage({
      ...defaultJourneyData,
      changeType: 'REMOVE_ALERT_RESTRICTION',
    })
    cy.url().should('to.match', /\/check-answers$/)
    cy.checkAxeAccessibility()

    cy.title().should('equal', 'Check your changes - Manage alert restrictions - DPS')
    cy.findByRole('heading', { name: /Check your changes/ }).should('be.visible')

    cy.contains('dt', 'Alert type').next().should('include.text', 'AA (AA description)')
    cy.contains('dt', 'Alert to remove restrictions from').next().should('include.text', 'BB (BB description)')

    cy.findByRole('link', { name: /Change the alert type/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /select-alert-type$/)

    cy.findByRole('link', { name: /Change the alert to remove restrictions from/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /select-alert-code$/)

    continueToConfirmation()
  })

  it('should check answers for Add Privileged User', () => {
    uuid = uuidV4()
    navigateToTestPage({
      ...defaultJourneyData,
      changeType: 'ADD_PRIVILEGED_USER',
      username: 'TEST_USER',
    })
    cy.url().should('to.match', /\/check-answers$/)
    cy.checkAxeAccessibility()

    cy.title().should('equal', 'Check your changes - Manage alert restrictions - DPS')
    cy.findByRole('heading', { name: /Check your changes/ }).should('be.visible')

    cy.contains('dt', 'Alert type').next().should('include.text', 'AA (AA description)')
    cy.contains('dt', /Alert $/)
      .next()
      .should('include.text', 'BB (BB description)')
    cy.contains('dt', 'Privileged user to add').next().should('include.text', 'TEST_USER')

    cy.findByRole('link', { name: /Change the alert type/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /select-alert-type$/)

    cy.findByRole('link', { name: /Change the alert$/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /select-alert-code$/)

    cy.findByRole('link', { name: /Change the username/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /select-user$/)

    continueToConfirmation()
  })

  it('should check answers for Remove Privileged User', () => {
    uuid = uuidV4()
    navigateToTestPage({
      ...defaultJourneyData,
      changeType: 'REMOVE_PRIVILEGED_USER',
      username: 'TEST_USER',
    })
    cy.url().should('to.match', /\/check-answers$/)
    cy.checkAxeAccessibility()

    cy.title().should('equal', 'Check your changes - Manage alert restrictions - DPS')
    cy.findByRole('heading', { name: /Check your changes/ }).should('be.visible')

    cy.contains('dt', 'Alert type').next().should('include.text', 'AA (AA description)')
    cy.contains('dt', /Alert $/)
      .next()
      .should('include.text', 'BB (BB description)')
    cy.contains('dt', 'Privileged user to remove').next().should('include.text', 'TEST_USER')

    cy.findByRole('link', { name: /Change the alert type/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /select-alert-type$/)

    cy.findByRole('link', { name: /Change the alert$/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /select-alert-code$/)

    cy.findByRole('link', { name: /Change the username/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /select-user$/)

    continueToConfirmation()
  })

  const navigateToTestPage = (journeyData: ManageAlertRestrictionsJourney) => {
    cy.signIn()
    cy.visit(`/${uuid}/manage-alert-restrictions`, { failOnStatusCode: false })
    injectJourneyDataAndReload(uuid, {
      restrictAlert: journeyData,
    })
    cy.visit(`/${uuid}/manage-alert-restrictions/check-answers`)
  }

  const continueToConfirmation = () => {
    cy.findByRole('button', { name: /Confirm and save/i }).click()
    cy.url().should('to.match', /\/confirmation(#[A-z]+)?$/)
  }
})
