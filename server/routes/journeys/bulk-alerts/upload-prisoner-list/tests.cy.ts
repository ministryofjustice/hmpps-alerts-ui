import { v4 as uuidV4 } from 'uuid'
import AuthorisedRoles from '../../../../authentication/authorisedRoles'
import injectJourneyDataAndReload from '../../../../../integration_tests/utils/e2eTestUtils'

context('test /bulk-alerts/upload-prisoner-list screen', () => {
  const uuid = uuidV4()

  const getChooseFile = () => cy.get('input[type="file"]')
  const getUploadButton = () => cy.findByRole('button', { name: /^Upload file$/ })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn', {
      roles: [AuthorisedRoles.ROLE_BULK_PRISON_ESTATE_ALERTS],
    })
    cy.task('stubGetAlertTypes')
  })

  it('should try out all cases', () => {
    navigateToTestPage()
    cy.url().should('to.match', /\/bulk-alerts\/upload-prisoner-list$/)

    cy.title().should('equal', 'Upload your list of prison numbers - Upload alerts in bulk - DPS')
    cy.findByRole('heading', { name: /Upload your list of prison numbers/ }).should('be.visible')
    cy.findByRole('link', { name: /^Back$/ })
      .should('be.visible')
      .and('have.attr', 'href')
      .and('match', /how-to-add-prisoners$/)

    getUploadButton().should('be.visible').click()

    cy.findByRole('link', { name: /You must select a file/ })
      .should('be.visible')
      .click()
    getChooseFile().should('be.focused')
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
        useCsvUpload: true,
      },
    })
    cy.visit(`/${uuid}/bulk-alerts/upload-prisoner-list`)
  }
})
