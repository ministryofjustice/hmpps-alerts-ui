import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import { nodeListForEach } from './components/utils'
import FormSpinner from './components/form-spinner'
import Card from './components/card'

govukFrontend.initAll()
mojFrontend.initAll()

var $cards = document.querySelectorAll('.card--clickable')
nodeListForEach($cards, function ($card) {
  new Card($card)
})

var $spinnerForms = document.querySelectorAll('[data-module="form-spinner"]')
nodeListForEach($spinnerForms, function ($spinnerForm) {
  new FormSpinner($spinnerForm)
})
