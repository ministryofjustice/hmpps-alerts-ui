import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import FormSpinner from './components/form-spinner'
import Card from './components/card'

govukFrontend.initAll()
mojFrontend.initAll()

var $cards = document.querySelectorAll('.card--clickable')
$cards.forEach(function ($card) {
  new Card($card)
})

var $spinnerForms = document.querySelectorAll('[data-module="form-spinner"]')
$spinnerForms.forEach(function ($spinnerForm) {
  new FormSpinner($spinnerForm)
})
