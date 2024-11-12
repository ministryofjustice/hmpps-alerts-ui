import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /bulk-alerts/review-prisoners screen', () => {
  const uuid = uuidV4()

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS],
    })
    cy.task('stubGetAlertTypes')
  })

  it('should try out all cases', () => {
    navigateToTestPage()
    cy.url().should('to.match', /\/bulk-alerts\/review-prisoners$/)

    // test with 2 selected prisoners
    cy.title().should(
      'equal',
      'Review the 2 prisoners that that will have the ‘OCG Nominal’ alert applied - Upload alerts in bulk - DPS',
    )
    cy.findByRole('heading', {
      name: /Review the 2 prisoners that that will have the ‘OCG Nominal’ alert applied/,
    }).should('be.visible')
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /how-to-add-prisoners$/)
    cy.findByText('A1111AA').should('be.visible')
    cy.findByText('B1111BB').should('be.visible')
    cy.findAllByRole('button', { name: /Add another person individually/ })
      .first()
      .should('have.attr', 'href')
      .and('match', /select-prisoner$/)
    cy.findAllByRole('button', { name: /Add people using a CSV file/ })
      .first()
      .should('have.attr', 'href')
      .and('match', /upload-prisoner-list$/)
    cy.findAllByRole('button', { name: /^Continue$/ })
      .first()
      .click()
    cy.url().should('to.match', /\/bulk-alerts\/select-upload-logic$/)
    cy.go('back')
    cy.reload()
    cy.findByRole('link', { name: /Remove prison number A1111AA/ })
      .should('be.visible')
      .click()

    // test with 1 selected prisoner
    cy.title().should(
      'equal',
      'Review the prisoner that that will have the ‘OCG Nominal’ alert applied - Upload alerts in bulk - DPS',
    )
    cy.findByRole('heading', {
      name: /Review the prisoner that that will have the ‘OCG Nominal’ alert applied/,
    }).should('be.visible')
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /how-to-add-prisoners$/)
    cy.findByText('A1111AA').should('not.exist')
    cy.findByText('B1111BB').should('be.visible')
    cy.findAllByRole('button', { name: /Add another person individually/ })
      .first()
      .should('have.attr', 'href')
      .and('match', /select-prisoner$/)
    cy.findAllByRole('button', { name: /Add people using a CSV file/ })
      .first()
      .should('have.attr', 'href')
      .and('match', /upload-prisoner-list$/)
    cy.findAllByRole('button', { name: /^Continue$/ })
      .first()
      .click()
    cy.url().should('to.match', /\/bulk-alerts\/select-upload-logic$/)
    cy.go('back')
    cy.reload()
    cy.findByRole('link', { name: /Remove prison number B1111BB/ })
      .should('be.visible')
      .click()

    // test with no selected prisoner
    cy.title().should('equal', 'There are no prisoners selected - Upload alerts in bulk - DPS')
    cy.findByRole('heading', {
      name: /There are no prisoners selected/,
    }).should('be.visible')
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /how-to-add-prisoners$/)
    cy.findByText('A1111AA').should('not.exist')
    cy.findByText('B1111BB').should('not.exist')
    cy.findByText('You’ve remove the last individual from this list.').should('be.visible')
    cy.findByRole('button', { name: /Add another person individually/ }).should('not.exist')
    cy.findByRole('button', { name: /Add people using a CSV file/ }).should('not.exist')
    cy.findByRole('button', { name: /^Continue$/ }).should('not.exist')
    cy.findByRole('button', { name: /^Add someone to the list$/ })
      .should('be.visible')
      .click()
    cy.url().should('to.match', /\/bulk-alerts\/how-to-add-prisoners$/)
  })

  const navigateToTestPage = () => {
    cy.signIn()
    cy.visit(`/${uuid}/bulk-alerts`, { failOnStatusCode: false })
    injectJourneyDataAndReload(uuid, {
      bulkAlert: {
        alertCode: {
          code: 'DOCGM',
          description: 'OCG Nominal',
        },
        useCsvUpload: false,
        prisonersSelected: [
          {
            firstName: 'TestName',
            lastName: 'User',
            prisonerNumber: 'A1111AA',
            cellLocation: 'A-1-1',
          },
          {
            firstName: 'John',
            lastName: 'Smith',
            prisonerNumber: 'B1111BB',
            cellLocation: 'A-1-1',
          },
        ],
      },
    })
    cy.visit(`/${uuid}/bulk-alerts/review-prisoners`)
  }
})
