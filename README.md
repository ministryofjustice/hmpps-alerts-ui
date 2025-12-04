# hmpps-alerts-ui
[![repo standards badge](https://img.shields.io/badge/endpoint.svg?&style=flat&logo=github&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fapi%2Fv1%2Fcompliant_public_repositories%2Fhmpps-alerts-ui)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/public-report/hmpps-alerts-ui "Link to report")
[![Docker Repository on GHCR](https://img.shields.io/badge/ghcr.io-repository-2496ED.svg?logo=docker)](https://ghcr.io/ministryofjustice/hmpps-alerts-ui)
[![Pipeline [test -> build -> deploy]](https://github.com/ministryofjustice/hmpps-alerts-ui/actions/workflows/pipeline.yml/badge.svg?branch=main)](https://github.com/ministryofjustice/hmpps-alerts-ui/actions/workflows/pipeline.yml)
[![codecov](https://codecov.io/github/ministryofjustice/hmpps-alerts-ui/branch/main/graph/badge.svg)](https://codecov.io/github/ministryofjustice/hmpps-alerts-ui)

This repository hosts the Alerts User Interface, a frontend application for managing, recording, and maintaining reference data for alerts across HMPPS services. Developed with Typescript, this project aims to provide a robust platform for alert data management, enhancing the operational efficiency and data accuracy within HMPPS.

## HMPPS Project Setup instructions

  * Make a copy of the `.env.local` file and rename it to `.env`
  * Populate the blank secret values in the new `.env` file with the dev secrets values from kubernetes. This file is ignored by git so should never be committed. In order to get the secret values you will need to get and transform the values from k8s like so: `kubectl get secrets/<secret_collection_name> --template={{.data.<secret>}} | base64 -d`. Repeat this for other env vars needed. Please see https://user-guide.cloud-platform.service.justice.gov.uk/documentation/getting-started/kubectl-config.html for guidance on K8s access.
  * Ask someone with access to manage user accounts in HMPPS Digital Services to create you a new user and grant the required roles:
    * ROLE_ALERTS_REFERENCE_DATA_MANAGER
    * ROLE_BULK_PRISON_ESTATE_ALERTS
  * Run `npm run setup` to install the dependencies
  * Run `npm run build` to compile the styling and build the views
  * Run `npm run start:dev` to start the UI
  * Use the new user details you got given to log in

## Testing

This project uses Jest for unit testing and Cypress for integration testing.

### Unit Tests

To run: `npm run test`

### Integration Tests

For local running, start a test redis and wiremock instance by:

`docker compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature`

And then either, run tests in headless mode with:

`npm run int-test`

Or run tests with the cypress UI:

`npm run int-test-ui`
