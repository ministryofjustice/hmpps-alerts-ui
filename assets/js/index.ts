import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import FormSpinner from './components/form-spinner'
import Card from './components/card'

govukFrontend.initAll()
mojFrontend.initAll()

const $cards = document.querySelectorAll<HTMLDivElement>('.card--clickable')
$cards.forEach($card => {
  new Card($card)
})

const $spinnerForms = document.querySelectorAll<HTMLFormElement>('[data-module="form-spinner"]')
$spinnerForms.forEach($spinnerForm => {
  new FormSpinner($spinnerForm)
})
