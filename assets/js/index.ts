import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import FormSpinner from './components/form-spinner'
import Card from './components/card'

govukFrontend.initAll()
mojFrontend.initAll()
govukFrontend.createAll(FormSpinner)

const $cards = document.querySelectorAll<HTMLDivElement>('.card--clickable')
$cards.forEach($card => {
  new Card($card)
})
