import { Component } from 'govuk-frontend'

export default class CardGroup extends Component<HTMLDivElement> {
  static moduleName = 'card-group'
  static elementType = HTMLDivElement

  constructor(root: HTMLDivElement) {
    super(root)

    const $cards = document.querySelectorAll<HTMLDivElement>('.card--clickable')
    $cards.forEach($card => {
      const $link = $card.querySelector('a')
      if ($link) {
        $card.addEventListener('click', () => {
          $link.click()
        })
      }
    })
  }
}
