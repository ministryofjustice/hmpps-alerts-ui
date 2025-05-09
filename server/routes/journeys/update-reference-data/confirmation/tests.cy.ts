import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'
import { UpdateReferenceDataJourney } from '../../../../@types/express'

context('test /update-reference-data/confirmation', () => {
  let uuid = uuidV4()

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
  })

  it('should show ADD_NEW ALERT_TYPE confirmation page', () => {
    uuid = uuidV4()
    navigateToTestPage({
      referenceDataType: 'ALERT_TYPE',
      changeType: 'ADD_NEW',
      code: 'ABC',
      description: 'Type Name',
    })
    cy.url().should('to.match', /\/confirmation$/)
    cy.title().should('equal', 'Alert type added - DPS')
    cy.findByText('Alert type added').should('be.visible')
    cy.findByText('You have added the Type Name alert type.').should('be.visible')

    validateCommonPageContents()
  })

  it('should show ADD_NEW ALERT_CODE confirmation page', () => {
    uuid = uuidV4()
    navigateToTestPage({
      referenceDataType: 'ALERT_CODE',
      changeType: 'ADD_NEW',
      code: 'ABC',
      description: 'Type Name',
    })
    cy.url().should('to.match', /\/confirmation$/)
    cy.title().should('equal', 'Alert added - DPS')
    cy.findByText('Alert added').should('be.visible')
    cy.findByText('You have added the Type Name alert.').should('be.visible')

    validateCommonPageContents()
  })

  it('should show EDIT_DESCRIPTION ALERT_CODE confirmation page', () => {
    uuid = uuidV4()
    navigateToTestPage({
      referenceDataType: 'ALERT_CODE',
      changeType: 'EDIT_DESCRIPTION',
      alertCode: {
        code: 'AA',
        description: 'Code Name',
        isActive: false,
        createdAt: '',
        createdBy: '',
        listSequence: 0,
        alertTypeCode: 'A',
      },
      description: 'New Name',
    })
    cy.url().should('to.match', /\/confirmation$/)
    cy.title().should('equal', 'Alert description updated - DPS')
    cy.findByText('Alert description updated').should('be.visible')
    cy.findByText('You have updated the description for the AA alert to ‘New Name’.').should('be.visible')

    validateCommonPageContents()
  })

  it('should show DEACTIVATE ALERT_CODE confirmation page', () => {
    uuid = uuidV4()
    navigateToTestPage({
      referenceDataType: 'ALERT_CODE',
      changeType: 'DEACTIVATE',
      alertCode: {
        code: 'A',
        description: 'Code Name',
        isActive: false,
        createdAt: '',
        createdBy: '',
        listSequence: 0,
        alertTypeCode: 'A',
      },
    })
    cy.url().should('to.match', /\/confirmation$/)
    cy.title().should('equal', 'Alert deactivated - DPS')
    cy.findByText('Alert deactivated').should('be.visible')
    cy.findByText('You have deactivated the A (Code Name) alert.').should('be.visible')

    validateCommonPageContents()
  })

  it('should show REACTIVATE ALERT_CODE confirmation page', () => {
    uuid = uuidV4()
    navigateToTestPage({
      referenceDataType: 'ALERT_CODE',
      changeType: 'REACTIVATE',
      alertCode: {
        code: 'A',
        description: 'Code Name',
        isActive: false,
        createdAt: '',
        createdBy: '',
        listSequence: 0,
        alertTypeCode: 'A',
      },
    })
    cy.url().should('to.match', /\/confirmation$/)
    cy.title().should('equal', 'Alert reactivated - DPS')
    cy.findByText('Alert reactivated').should('be.visible')
    cy.findByText('You have reactivated the A (Code Name) alert.').should('be.visible')

    validateCommonPageContents()
  })

  const validateCommonPageContents = () => {
    cy.findByRole('button', { name: 'Return to manage prisoner alerts' })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('equal', '/')
  }

  const navigateToTestPage = (journeyData: UpdateReferenceDataJourney) => {
    cy.signIn()
    cy.visit(`/${uuid}/update-reference-data`, { failOnStatusCode: false })
    injectJourneyDataAndReload(uuid, {
      updateRefData: journeyData,
    })
    cy.visit(`/${uuid}/update-reference-data/confirmation`)
  }
})
