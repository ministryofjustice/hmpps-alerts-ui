import axe, { Result, Spec } from 'axe-core'
import { fail } from 'assert'

const logAccessibilityViolations = (violations: Result[]) => {
  cy.task('logAccessibilityViolationsSummary', `Accessibility violations detected: ${violations.length}`)

  const violationData = violations.map(violation => ({
    ...violation,
    nodes: violation.nodes.length,
    nodeTargets: violation.nodes.map(node => node.target).join(' - '),
  }))

  cy.task('logAccessibilityViolationsTable', violationData)
}

export const checkAxeAccessibility = () => {
  cy.window({ log: false })
    .then(win => {
      win.eval(axe.source)
      const axeInstance = (win as unknown as Window & { axe: typeof axe }).axe
      axeInstance.configure({
        rules: [
          // Temporary rule whilst this issue is resolved https://github.com/w3c/aria/issues/1404
          { id: 'aria-allowed-attr', reviewOnFail: true },
          // Ignore the "All page content should be contained by landmarks", which conflicts with GOV.UK guidance (https://design-system.service.gov.uk/components/back-link/#how-it-works)
          { id: 'region', reviewOnFail: true, selector: '.govuk-back-link' },
          { id: 'empty-table-header', reviewOnFail: true },
          // Allow MOJ Pagination components to have duplicate aria label (when used in pair on top and bottom of a table)
          { id: 'landmark-unique', reviewOnFail: true, selector: '.moj-pagination' },
        ],
      } as Spec)
      return axeInstance.run(win.document)
    })
    .then(({ violations }) => {
      if (violations.length) {
        logAccessibilityViolations(violations)
        fail(`${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} detected`)
      }
    })

  checkStyleRules()
}

const checkStyleRules = () => {
  // No un-curly apostrophes in text
  cy.contains('*', `'`)
    .should('have.length.gte', 0)
    .each(element => {
      if (element.hasClass('govuk-summary-list__value') || element.hasClass('govuk-inset-text')) {
        return
      }
      const textExcludeTesname = element.text().replace(/Tes'name/gi, '')
      if (textExcludeTesname.includes("'")) {
        fail(`Non-curly apostrophe found in the following text: ${element.text()}`)
      }
    })
}

export default {
  logAccessibilityViolationsSummary: (message: string): null => {
    // eslint-disable-next-line no-console
    console.log(message)

    return null
  },
  logAccessibilityViolationsTable: (violations: Result[]): null => {
    // eslint-disable-next-line no-console
    console.table(violations)

    return null
  },
}
