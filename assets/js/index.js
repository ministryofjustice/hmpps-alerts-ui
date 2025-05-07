import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import { nodeListForEach } from './utils'
import FormSpinner from './form-spinner'
import Card from './card'

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
