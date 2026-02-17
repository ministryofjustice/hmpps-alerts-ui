export default class FormSpinner {
  private spinnerSvg =
    '<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>'

  constructor(private readonly container: HTMLFormElement) {
    this.container.addEventListener('submit', () => {
      const formSpinner = document.createElement('div')
      formSpinner.classList.add('form-spinner')
      formSpinner.innerHTML = `
        <div class="form-spinner__notification-box" role="alert">
          ${this.container.dataset.loadingText ?? 'Loading'}
          <div class="form-spinner__spinner">
            ${this.spinnerSvg}
          </div>
        </div>
      `

      setTimeout(() => document.querySelector('body')?.appendChild(formSpinner), 1000)

      const buttons = this.container.querySelectorAll<HTMLButtonElement>('[data-module="govuk-button"]')
      buttons.forEach(function (button) {
        button.setAttribute('disabled', 'disabled')
        button.setAttribute('aria-disabled', 'true')
      })
    })
  }
}
