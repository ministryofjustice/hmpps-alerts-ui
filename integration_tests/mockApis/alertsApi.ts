import { stubFor } from './wiremock'

const stubCreateAlertType = () => {
  return stubFor({
    request: {
      method: 'POST',
      urlPattern: '/alerts-api/alert-types',
    },
    response: {
      status: 201,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        code: 'AA',
      },
    },
  })
}

const stubCreateAlertCode = () => {
  return stubFor({
    request: {
      method: 'POST',
      urlPattern: '/alerts-api/alert-codes',
    },
    response: {
      status: 201,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        code: 'AA',
      },
    },
  })
}

const stubGetAlertTypes = () => {
  return stubFor({
    request: {
      method: 'GET',
      urlPattern: '/alerts-api/alert-types.*',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: [
        {
          code: 'DB',
          description: 'DB description',
          isActive: true,
          alertCodes: [
            {
              code: 'AA',
              description: 'AA description',
              isActive: true,
            },
            {
              code: 'DOCGM',
              description: 'OCG Nominal',
              isActive: true,
            },
          ],
        },
        {
          code: 'AA',
          description: 'A description',
          isActive: true,
          alertCodes: [],
        },
      ],
    },
  })
}

const stubGetDeactivatedAlertTypes = () => {
  return stubFor({
    request: {
      method: 'GET',
      urlPattern: '/alerts-api/alert-types.*',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: [
        {
          code: 'DB',
          description: 'A description',
          isActive: false,
          alertCodes: [
            {
              code: 'AA',
              description: 'A description',
              isActive: false,
            },
          ],
        },
        {
          code: 'AA',
          description: 'A description',
          isActive: false,
        },
      ],
    },
  })
}

const stubGetDeactivatedAlertCodes = () => {
  return stubFor({
    request: {
      method: 'GET',
      urlPattern: '/alerts-api/alert-types.*',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: [
        {
          code: 'DB',
          description: 'A description',
          isActive: true,
          alertCodes: [
            {
              code: 'AA',
              description: 'A description',
              isActive: false,
            },
          ],
        },
        {
          code: 'AA',
          description: 'A description',
          isActive: true,
        },
      ],
    },
  })
}

const stubDeactivateAlertCode = () => {
  return stubFor({
    request: {
      method: 'PATCH',
      urlPattern: '/alerts-api/alert-codes/AA/deactivate',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        code: 'AA',
      },
    },
  })
}

const stubReactivateAlertCode = () => {
  return stubFor({
    request: {
      method: 'PATCH',
      urlPattern: '/alerts-api/alert-codes/AA/reactivate',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        code: 'AA',
      },
    },
  })
}

const stubDeactivateAlertType = () => {
  return stubFor({
    request: {
      method: 'PATCH',
      urlPattern: '/alerts-api/alert-types/DB/deactivate',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        code: 'DB',
        description: 'New Description',
      },
    },
  })
}

const stubReactivateAlertType = () => {
  return stubFor({
    request: {
      method: 'PATCH',
      urlPattern: '/alerts-api/alert-types/DB/reactivate',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        code: 'DB',
        description: 'Description',
      },
    },
  })
}

const stubUpdateAlertType = () => {
  return stubFor({
    request: {
      method: 'PATCH',
      urlPattern: '/alerts-api/alert-types/DB',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        code: 'DB',
        description: 'New Description',
      },
    },
  })
}

const stubUpdateAlertCode = () => {
  return stubFor({
    request: {
      method: 'PATCH',
      urlPattern: '/alerts-api/alert-codes/AA',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        code: 'AA',
        description: 'New Description',
      },
    },
  })
}

const stubCreateAlert = () => {
  return stubFor({
    request: {
      method: 'POST',
      urlPattern: '/alerts-api/prisoners/[A-z0-9]*/alerts\\?allowInactiveCode=true',
    },
    response: {
      status: 201,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        code: 'AA',
      },
    },
  })
}

const stubGetPrisonerAlertsNotFound = () => {
  return stubFor({
    request: {
      method: 'GET',
      urlPattern: '/alerts-api/prisoners/[A-z0-9]*/alerts.*',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        totalElements: 0,
      },
    },
  })
}

const stubGetPrisonerAlertsFound = () => {
  return stubFor({
    request: {
      method: 'GET',
      urlPattern: '/alerts-api/prisoners/[A-z0-9]*/alerts.*',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        totalElements: 1,
      },
    },
  })
}

const stubPlanBulkAlerts = () => {
  return stubFor({
    request: {
      method: 'POST',
      urlPattern: '/alerts-api/bulk-alerts/plan',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        request: {
          prisonNumbers: 'A1234AA',
          alertCode: 'ABC',
          description: 'Alert description',
          cleanupMode: 'KEEP_ALL',
        },
        existingActiveAlertsPrisonNumbers: ['string'],
        alertsToBeCreatedForPrisonNumbers: ['string'],
        alertsToBeUpdatedForPrisonNumbers: ['string', 'string'],
        alertsToBeExpiredForPrisonNumbers: ['string', 'string'],
      },
    },
  })
}

const stubCreateBulkAlerts = () => {
  return stubFor({
    request: {
      method: 'POST',
      urlPattern: '/alerts-api/bulk-alerts',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        existingActiveAlerts: [
          {
            alertUuid: '8cdadcf3-b003-4116-9956-c99bd8df6a00',
            prisonNumber: 'A1234AA',
            message: 'string',
          },
        ],
        alertsCreated: [
          {
            alertUuid: '8cdadcf3-b003-4116-9956-c99bd8df6a00',
            prisonNumber: 'A1234AA',
            message: 'string',
          },
        ],
        alertsUpdated: [
          {
            alertUuid: '8cdadcf3-b003-4116-9956-c99bd8df6a00',
            prisonNumber: 'A1234AA',
            message: 'string',
          },
        ],
        alertsExpired: [],
      },
    },
  })
}

export default {
  stubCreateAlertType,
  stubGetAlertTypes,
  stubGetDeactivatedAlertTypes,
  stubGetDeactivatedAlertCodes,
  stubCreateAlertCode,
  stubDeactivateAlertCode,
  stubReactivateAlertCode,
  stubDeactivateAlertType,
  stubReactivateAlertType,
  stubUpdateAlertType,
  stubUpdateAlertCode,
  stubCreateAlert,
  stubPlanBulkAlerts,
  stubCreateBulkAlerts,
  stubGetPrisonerAlertsNotFound,
  stubGetPrisonerAlertsFound,
}
