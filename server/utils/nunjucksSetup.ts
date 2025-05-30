/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks from 'nunjucks'
import express from 'express'
import fs from 'fs'
import { convertToTitleCase, firstNameLastName, initialiseName, prisonerName } from './utils'
import config from '../config'
import logger from '../../logger'
import { buildErrorSummaryList, customErrorOrderBuilder, findError } from '../middleware/validationMiddleware'
import { addDefaultSelectedValue, setSelected } from './viewUtils'

export default function nunjucksSetup(app: express.Express): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'HMPPS Alerts'
  app.locals.environmentName = config.environmentName
  app.locals.environmentNameColour = config.environmentName === 'PRE-PRODUCTION' ? 'govuk-tag--green' : ''
  app.locals.digitalPrisonServicesUrl = config.serviceUrls.digitalPrison
  let assetManifest: Record<string, string> = {}

  try {
    const assetMetadataPath = path.resolve(__dirname, '../../assets/manifest.json')
    assetManifest = JSON.parse(fs.readFileSync(assetMetadataPath, 'utf8'))
  } catch (e) {
    if (process.env.NODE_ENV !== 'test') {
      logger.error(e, 'Could not read asset manifest file')
    }
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      path.join(__dirname, '../../server/routes'),
      path.join(__dirname, '../../server/routes/journeys'),
      'node_modules/govuk-frontend/dist/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/hmpps-connect-dps-components/dist/assets/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )
  njkEnv.addFilter('buildErrorSummaryList', buildErrorSummaryList)
  njkEnv.addFilter('findError', findError)
  njkEnv.addFilter('customErrorOrderBuilder', customErrorOrderBuilder)
  njkEnv.addFilter('addDefaultSelectedValue', addDefaultSelectedValue)
  njkEnv.addFilter('setSelected', setSelected)
  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('toTitleCase', convertToTitleCase)
  njkEnv.addFilter('firstNameLastName', firstNameLastName)
  njkEnv.addFilter('prisonerName', (str, bold) => {
    const name = prisonerName(str, bold)
    return name ? njkEnv.getFilter('safe')(name) : null
  })
  njkEnv.addFilter('prisonerNameForSorting', str => {
    const name = njkEnv.getFilter('prisonerName')(str, false)
    return name.val || null
  })
  njkEnv.addFilter('assetMap', (url: string) => assetManifest[url] || url)
}
