export default class Card {
  constructor(private readonly container: HTMLDivElement) {
    if (this.container.querySelector('a') !== null) {
      this.container.addEventListener('click', () => {
        this.container.querySelector('a')?.click()
      })
    }
  }
}
