import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /bulk-alerts/select-prisoner screen', () => {
  const uuid = uuidV4()

  const getQueryInput = () => cy.findByRole('textbox', { name: /Who should have the ‘OCG Nominal’ alert applied\?/ })
  const getSearchButton = () => cy.findByRole('button', { name: /^Search$/ })
  const getSelectButton = () => cy.findByRole('button', { name: /^Select and continue$/ })
  const getContinueButton = () => cy.findByRole('button', { name: /^Continue$/ })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS],
    })
    cy.task('stubGetAlertTypes')
    cy.task('stubPatchBulkAlertsPlan')
  })

  it('should try out all cases for single-result happy path', () => {
    cy.task('stubPostPrisonerSearchOneFound')
    navigateToTestPage()
    cy.url().should('to.match', /\/bulk-alerts\/select-prisoner$/)
    validatePageContents()

    // test validation error for query text field
    getSearchButton().click()
    cy.findByRole('link', { name: /You must enter a name or prison number in the format A1234CD$/i })
      .should('be.visible')
      .click()
    getQueryInput().should('be.focused')

    // search and found one result, then proceed to next page
    getQueryInput().type('A1111AA', { delay: 0 })
    getSearchButton().click()
    getSelectButton().should('not.exist')
    getContinueButton().should('be.visible').click()
    cy.url().should('to.match', /\/bulk-alerts\/review-prisoners$/)
  })

  it('should try out all cases for multiple-result happy path', () => {
    cy.task('stubPostPrisonerSearchTwoFound')
    navigateToTestPage()
    cy.url().should('to.match', /\/bulk-alerts\/select-prisoner$/)

    getQueryInput().type('A1111AA', { delay: 0 })
    getSearchButton().click()
    getContinueButton().should('not.exist')

    // test validation error for prisoner selection (if more than one is found)
    getSelectButton().should('be.visible').click()
    cy.findByRole('link', { name: /You must select one option$/i })
      .should('be.visible')
      .click()

    // select a prisoner and proceed to next page
    cy.findByRole('radio', { name: /Testname/ })
      .should('be.focused')
      .click()
    getSelectButton().click()
    cy.url().should('to.match', /\/bulk-alerts\/review-prisoners$/)
  })

  it('should show error message when no result is found', () => {
    cy.task('stubPostPrisonerSearchNoneFound')
    navigateToTestPage()
    cy.url().should('to.match', /\/bulk-alerts\/select-prisoner$/)

    getQueryInput().type('A1111AA', { delay: 0 })
    getSearchButton().click()
    getSelectButton().should('not.exist')
    getContinueButton().should('not.exist')
    cy.findByText('There are no matching search results.').should('be.visible')
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
      },
    })
    cy.visit(`/${uuid}/bulk-alerts/select-prisoner`)
  }

  const validatePageContents = () => {
    cy.title().should('equal', 'Who should have the ‘OCG Nominal’ alert applied? - Upload alerts in bulk - DPS')
    cy.findByRole('heading', {
      name: /Who should have the ‘OCG Nominal’ alert applied\?/,
    }).should('be.visible')
    getQueryInput().should('be.visible')
    getSearchButton().should('be.visible')
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /how-to-add-prisoners$/)
  }
})
