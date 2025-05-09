import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'
import { UpdateReferenceDataJourney } from '../../../../@types/express'

context('test /update-reference-data/check-answers', () => {
  let uuid = uuidV4()

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubCreateAlertType')
    cy.task('stubCreateAlertCode')
    cy.task('stubReactivateAlertCode')
    cy.task('stubUpdateAlertCode')
    cy.task('stubUpdateAlertType')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
  })

  it('should check answers for Create Alert Type', () => {
    uuid = uuidV4()
    navigateToTestPage({
      referenceDataType: 'ALERT_TYPE',
      changeType: 'ADD_NEW',
      code: 'ABC',
      description: 'Some text',
    })
    cy.url().should('to.match', /\/check-answers$/)

    cy.title().should('equal', 'Check your changes - Maintain alerts reference data - DPS')
    cy.findByRole('heading', { name: /Check your changes/ }).should('be.visible')

    cy.contains('dt', 'New alert type').next().should('include.text', 'ABC')
    cy.contains('dt', 'New alert description').next().should('include.text', 'Some text')

    cy.findByRole('link', { name: /Change the alert type code/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /add-alert-type#code$/)

    cy.findByRole('link', { name: /Change the alert type description/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /add-alert-type#description$/)

    continueToConfirmation()
  })

  it('should check answers for Edit Alert Type', () => {
    uuid = uuidV4()
    navigateToTestPage({
      referenceDataType: 'ALERT_TYPE',
      changeType: 'EDIT_DESCRIPTION',
      alertType: {
        code: 'DB',
        description: 'Type Name',
        isActive: true,
        listSequence: 0,
        createdAt: '',
        createdBy: '',
      },
      description: 'New Name',
    })
    cy.url().should('to.match', /\/check-answers$/)

    cy.title().should('equal', 'Check your changes - Maintain alerts reference data - DPS')
    cy.findByRole('heading', { name: /Check your changes/ }).should('be.visible')

    cy.contains('dt', 'Alert type').next().should('include.text', 'DB (Type Name)')
    cy.contains('dt', 'New alert type description').next().should('include.text', 'New Name')

    cy.findByRole('link', { name: /Change the alert type/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /select-alert-type$/)

    cy.findByRole('link', { name: /Change the new alert type description/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /edit-alert-type$/)

    continueToConfirmation()
  })

  it('should check answers for Create Alert Code', () => {
    uuid = uuidV4()
    navigateToTestPage({
      referenceDataType: 'ALERT_CODE',
      changeType: 'ADD_NEW',
      code: 'ABC',
      description: 'Some text',
      alertType: {
        code: 'AB',
        description: 'Type Name',
        isActive: true,
        listSequence: 0,
        createdAt: '',
        createdBy: '',
      },
    })
    cy.url().should('to.match', /\/check-answers$/)

    cy.title().should('equal', 'Check your changes - Maintain alerts reference data - DPS')
    cy.findByRole('heading', { name: /Check your changes/ }).should('be.visible')

    cy.contains('dt', 'Alert type').next().should('include.text', 'AB (Type Name)')
    cy.contains('dt', 'New alert code').next().should('include.text', 'ABC')
    cy.contains('dt', 'New alert description').next().should('include.text', 'Some text')

    cy.findByRole('link', { name: /Change the alert type/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /select-alert-type$/)

    cy.findByRole('link', { name: /Change the alert code/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /add-alert-code#code$/)

    cy.findByRole('link', { name: /Change the alert description/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /add-alert-code#description$/)

    continueToConfirmation()
  })

  it('should check answers for Edit Alert Code', () => {
    uuid = uuidV4()
    navigateToTestPage({
      referenceDataType: 'ALERT_CODE',
      changeType: 'EDIT_DESCRIPTION',
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
      description: 'New Name',
    })
    cy.url().should('to.match', /\/check-answers$/)

    cy.title().should('equal', 'Check your changes - Maintain alerts reference data - DPS')
    cy.findByRole('heading', { name: /Check your changes/ }).should('be.visible')

    cy.contains('dt', 'Alert type').next().should('include.text', 'AB (Type Name)')
    cy.contains('dt', /Alert\s+$/)
      .next()
      .should('include.text', 'AA (Code Name)')
    cy.contains('dt', 'New alert description').next().should('include.text', 'New Name')

    cy.findByRole('link', { name: /Change the alert type/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /select-alert-type$/)

    cy.findByRole('link', { name: /Change the alert to be edited/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /select-alert-code$/)

    cy.findByRole('link', { name: /Change the new alert description/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /edit-alert-code$/)

    continueToConfirmation()
  })

  it('should check answers for Reactivate Alert Code', () => {
    uuid = uuidV4()
    navigateToTestPage({
      referenceDataType: 'ALERT_CODE',
      changeType: 'REACTIVATE',
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
    })
    cy.url().should('to.match', /\/check-answers$/)

    cy.title().should('equal', 'Check your changes - Maintain alerts reference data - DPS')
    cy.findByRole('heading', { name: /Check your changes/ }).should('be.visible')

    cy.contains('dt', 'Alert type').next().should('include.text', 'AB (Type Name)')
    cy.contains('dt', 'Alert to be reactivated').next().should('include.text', 'AA (Code Name)')

    cy.findByRole('link', { name: /Change the alert type/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /select-alert-type$/)

    cy.findByRole('link', { name: /Change the alert to be reactivated/i })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('to.match', /select-alert-code$/)

    continueToConfirmation()
  })

  const navigateToTestPage = (journeyData: UpdateReferenceDataJourney) => {
    cy.signIn()
    cy.visit(`/${uuid}/update-reference-data`, { failOnStatusCode: false })
    injectJourneyDataAndReload(uuid, {
      updateRefData: journeyData,
    })
    cy.visit(`/${uuid}/update-reference-data/check-answers`)
  }

  const continueToConfirmation = () => {
    cy.findByRole('button', { name: /Confirm and save/i }).click()
    cy.url().should('to.match', /\/confirmation(#[A-z]+)?$/)
  }
})
