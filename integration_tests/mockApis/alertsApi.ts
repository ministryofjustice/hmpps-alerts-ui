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
      urlPattern: '/alerts-api/prisoners/[A-z0-9]*/alerts',
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
  stubGetPrisonerAlertsNotFound,
  stubGetPrisonerAlertsFound,
}
