# Project Setup Instructions

This document provides a set of general instructions and guidelines for setting up new projects within the HMPPS ecosystem.

## Creating a Cloud Platform namespace

To deploy to a new namespace, you might want to use this project's namespace as a template:

[Template Namespace on GitHub](https://github.com/ministryofjustice/cloud-platform-environments/tree/main/namespaces/live.cloud-platform.service.justice.gov.uk/hmpps-alerts-ui)

Copy this folder, update all references to the namespace accordingly, and submit a PR to the Cloud Platform team. Additional instructions can be found [here](https://user-guide.cloud-platform.service.justice.gov.uk/#cloud-platform-user-guide).

## Renaming from HMPPS Template Typescript - GitHub Actions

After deploying your repository, enable Actions via the GitHub `Actions` tab.

Run the `rename-project-create-pr` workflow to automatically rename the project and create a PR for review.

## Manually Branding from Template App

Run the `rename-project.bash` script with the project's name as the argument. This script performs a search and replace across the project, updating names and directories to match your new project's name.

## Slack Notifications

To ensure notifications are correctly routed, update the `alerts-slack-channel` and `releases-slack-channel` parameters in `.circleci/config.yml` with your designated Slack channels.

## Setting the `productId`

Set the product ID of your application in `values.yaml` to match the Service Catalogue for easy identification. The Service Catalogue is available [here](https://developer-portal.hmpps.service.justice.gov.uk/products).

## Running the App

Use Docker Compose for a straightforward setup:

```bash
docker compose pull
docker compose up
