import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('Manage prisoner alerts')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')
}
