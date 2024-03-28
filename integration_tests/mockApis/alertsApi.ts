import { stubFor } from './wiremock'

const stubCreateAlertType = () => {
  console.log('Stubbing create alert request')
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

export default {
  stubCreateAlertType,
}
