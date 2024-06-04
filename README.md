# hmpps-alerts-ui
[![repo standards badge](https://img.shields.io/badge/dynamic/json?color=blue&style=flat&logo=github&label=MoJ%20Compliant&query=%24.result&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-alerts-ui)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-github-repositories.html#hmpps-alerts-ui "Link to report")
[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-alerts-ui/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-alerts-ui)

This repository hosts the Alerts User Interface, a frontend application for managing, recording, and maintaining reference data for alerts across HMPPS services. Developed with Typescript, this project aims to provide a robust platform for alert data management, enhancing the operational efficiency and data accuracy within HMPPS.

## HMPPS Project Setup instructions

  * Make a copy of the `.env.local` file and rename it to `.env`
  * Ensure that `HMPPS_ALERTS_UI_APPINSIGHTS_KEY`, `HMPPS_ALERTS_UI_API_CLIENT_ID`, `HMPPS_ALERTS_UI_API_CLIENT_SECRET`, `HMPPS_ALERTS_UI_SYSTEM_CLIENT_ID`, `HMPPS_ALERTS_UI_SYSTEM_CLIENT_SECRET` and any other system vars prefixed with `$` in your new `.env` file are populated via your `.zprofile` or `.bash_profile` file, or whatever normal method you use to set system variables. If that's not possible, edit these references in your .env file (NOT the .env.local file) and hard-code the secrets/keys in. This file is ignored by git so should never be committed. In order to get the actual values of these, you can put something like this `export HMPPS_ALERTS_UI_API_CLIENT_ID=$(kubectl get secrets/hmpps-alerts-ui --template={{.data.API_CLIENT_ID}} | base64 -d)` in your `.zprofile`, and repeat for other env vars needed. Please see https://user-guide.cloud-platform.service.justice.gov.uk/documentation/getting-started/kubectl-config.html for guidance on K8s access.
  * Ask David Winchurch or someone else with access to manage user accounts in HMPPS Digital Services, to create you a new user
  * Run `npm ci` to install the dependencies
  * Run `npm run build` to compile the styling and build the views
  * Run `npm run start:dev` to start the UI
  * Use the new user details you got given to log in