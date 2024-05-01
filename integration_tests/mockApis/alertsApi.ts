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
      urlPattern: '/alerts-api/alert-types',
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
              isActive: true,
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
      method: 'DELETE',
      urlPattern: '/alerts-api/alert-codes/AA',
    },
    response: {
      status: 204,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  })
}

const stubDeactivateAlertType = () => {
  return stubFor({
    request: {
      method: 'DELETE',
      urlPattern: '/alerts-api/alert-types/DB',
    },
    response: {
      status: 204,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
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

export default {
  stubCreateAlertType,
  stubGetAlertTypes,
  stubCreateAlertCode,
  stubDeactivateAlertCode,
  stubDeactivateAlertType,
  stubUpdateAlertType,
}
