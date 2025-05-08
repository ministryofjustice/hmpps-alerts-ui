import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /update-reference-data/confirmation', () => {
  const uuid = uuidV4()

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_ALERTS_REFERENCE_DATA_MANAGER],
    })
  })

  it('should try out all cases', () => {
    navigateToTestPage()
    cy.url().should('to.match', /\/confirmation$/)
    cy.title().should('equal', 'Alert type added - DPS')

    validatePageContents()
  })

  const validatePageContents = () => {
    cy.findByText('Alert type added').should('be.visible')

    cy.findByText('You have added the Type Name alert type.').should('be.visible')

    cy.findByRole('button', { name: 'Return to manage prisoner alerts' })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('equal', '/')
  }

  const navigateToTestPage = () => {
    cy.signIn()
    cy.visit(`/${uuid}/update-reference-data`, { failOnStatusCode: false })
    injectJourneyDataAndReload(uuid, {
      updateRefData: {
        referenceDataType: 'ALERT_TYPE',
        changeType: 'ADD_NEW',
        code: 'ABC',
        description: 'Type Name',
      },
    })
    cy.visit(`/${uuid}/update-reference-data/confirmation`)
  }
})
