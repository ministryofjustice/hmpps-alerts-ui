import { Component } from 'govuk-frontend'

export default class FormSpinner extends Component<HTMLFormElement> {
  static moduleName = 'form-spinner'
  static elementType = HTMLFormElement

  constructor(root: HTMLFormElement) {
    super(root)

    root.addEventListener('submit', () => {
      this.disableButtons()
      setTimeout(() => this.showSpinner(), 1000)
    })
  }

  private disableButtons() {
    const buttons = this.$root.querySelectorAll<HTMLButtonElement>('[data-module="govuk-button"]')
    buttons.forEach(button => {
      button.setAttribute('disabled', 'disabled')
      button.setAttribute('aria-disabled', 'true')
    })
  }

  private spinnerSvg =
    '<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>'

  private showSpinner(): void {
    const formSpinner = document.createElement('div')
    formSpinner.classList.add('form-spinner')
    formSpinner.innerHTML = `
        <div class="form-spinner__notification-box" role="alert">
          ${this.$root.dataset.loadingText ?? 'Loading'}
          <div class="form-spinner__spinner">
            ${this.spinnerSvg}
          </div>
        </div>
      `
    document.querySelector('body')?.appendChild(formSpinner)
  }
}
