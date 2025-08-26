import { stubFor } from './wiremock'

const stubPrisonerSearchPing = (httpStatus = 200) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/prisoner-search-api/health/ping',
    },
    response: {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
    },
  })

const stubGetPrisoner = () => {
  return stubFor({
    request: {
      method: 'GET',
      urlPattern: '/prisoner-search-api/prisoner/[A-z0-9]*',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        firstName: 'TestName',
        lastName: 'User',
        prisonerNumber: 'A1111AA',
        dateOfBirth: '1932-02-02',
        status: 'On remand',
        prisonName: 'HMP Kirkham',
        cellLocation: 'A-1-1',
      },
    },
  })
}

const stubGetPrisoner500 = () => {
  return stubFor({
    request: {
      method: 'GET',
      urlPattern: '/prisoner-search-api/prisoner/[A-z0-9]*',
    },
    response: {
      status: 500,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {},
    },
  })
}

const stubPostPrisonerSearchOneFound = () => {
  return stubFor({
    request: {
      method: 'POST',
      urlPattern: '/prisoner-search-api/prisoner-search/match-prisoners',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: [
        {
          firstName: 'TestName',
          lastName: 'User',
          prisonerNumber: 'A1111AA',
          dateOfBirth: '1932-02-02',
          status: 'On remand',
          prisonName: 'HMP Kirkham',
          cellLocation: 'A-1-1',
        },
      ],
    },
  })
}

const stubPostPrisonerSearchTwoFound = () => {
  return stubFor({
    request: {
      method: 'POST',
      urlPattern: '/prisoner-search-api/prisoner-search/match-prisoners',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: [
        {
          firstName: 'TestName',
          lastName: 'User',
          prisonerNumber: 'A1111AA',
          dateOfBirth: '1932-02-02',
          status: 'On remand',
          prisonName: 'HMP Kirkham',
          cellLocation: 'A-1-1',
        },
        {
          firstName: 'John',
          lastName: 'Smith',
          prisonerNumber: 'B1111BB',
          dateOfBirth: '1932-02-02',
          status: 'On remand',
          prisonName: 'HMP Kirkham',
          cellLocation: 'A-1-1',
        },
      ],
    },
  })
}

const stubPostPrisonerSearchNoneFound = () => {
  return stubFor({
    request: {
      method: 'POST',
      urlPattern: '/prisoner-search-api/prisoner-search/match-prisoners',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: [],
    },
  })
}

const stubPostPrisonerSearchByNumber = () => {
  return stubFor({
    request: {
      method: 'POST',
      urlPattern: '/prisoner-search-api/prisoner-search/prisoner-numbers',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: [
        {
          firstName: 'TestName',
          lastName: 'User',
          prisonerNumber: 'A1111AA',
          dateOfBirth: '1932-02-02',
          status: 'On remand',
          prisonName: 'HMP Kirkham',
          cellLocation: 'A-1-1',
        },
      ],
    },
  })
}

export default {
  stubPrisonerSearchPing,
  stubGetPrisoner,
  stubGetPrisoner500,
  stubPostPrisonerSearchNoneFound,
  stubPostPrisonerSearchOneFound,
  stubPostPrisonerSearchTwoFound,
  stubPostPrisonerSearchByNumber,
}
