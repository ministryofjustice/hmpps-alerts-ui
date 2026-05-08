import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import CardGroup from './components/card-group'
import FormSpinner from './components/form-spinner'

govukFrontend.initAll()
mojFrontend.initAll()
govukFrontend.createAll(CardGroup)
govukFrontend.createAll(FormSpinner)
