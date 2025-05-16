import { Spec } from 'axe-core'
import { getLastAPICallMatching } from '../mockApis/wiremock'
import { checkAxeAccessibility } from './accessibilityViolations'

Cypress.Commands.add('signIn', (options = { failOnStatusCode: true }) => {
  cy.request('/')
  return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
})

Cypress.Commands.add('verifyLastAPICall', (matching: string | object, expected: object) => {
  return cy.wrap(getLastAPICallMatching(matching)).should('deep.equal', expected)
})

Cypress.Commands.add('clickLink', (name: string | RegExp) => cy.findByRole('link', { name }).click())

Cypress.Commands.add('clickRadio', (name: string | RegExp) => cy.findByRole('radio', { name }).click())

Cypress.Commands.add('clickContinueButton', (name: string | RegExp = 'Continue') =>
  cy.findByRole('button', { name }).click(),
)

Cypress.Commands.add('fillTextbox', (name, value) => {
  cy.findByRole('textbox', { name }).clear()
  return cy.findByRole('textbox', { name }).type(value, { delay: 0 })
})

Cypress.Commands.add('checkAxeAccessibility', () => checkAxeAccessibility)
