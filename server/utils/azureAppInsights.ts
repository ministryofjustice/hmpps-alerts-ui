import {
  Contracts,
  defaultClient,
  DistributedTracingModes,
  getCorrelationContext,
  setup,
  type TelemetryClient,
} from 'applicationinsights'
import { Request, RequestHandler } from 'express'
import { v4 } from 'uuid'
import { CorrelationContext } from 'applicationinsights/out/AutoCollection/CorrelationContextManager'
import { EnvelopeTelemetry } from 'applicationinsights/out/Declarations/Contracts'
import type { ApplicationInfo } from '../applicationInfo'

const requestPrefixesToIgnore = ['GET /assets/', 'GET /health', 'GET /ping', 'GET /info']
const dependencyPrefixesToIgnore = ['sqs']

export type ContextObject = {
  ['http.ServerRequest']?: Request
  correlationContext?: CorrelationContext
}

export function initialiseAppInsights(): void {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    // eslint-disable-next-line no-console
    console.log('Enabling azure application insights')

    setup().setDistributedTracingMode(DistributedTracingModes.AI_AND_W3C).start()
  }
}

function addUserDataToRequests(envelope: EnvelopeTelemetry, contextObjects: Record<string, unknown> | undefined) {
  const isRequest = envelope.data.baseType === Contracts.TelemetryTypeString.Request
  if (isRequest) {
    const { username, activeCaseLoadId } =
      (contextObjects?.['http.ServerRequest'] as Request | undefined)?.res?.locals?.user || {}
    if (username && activeCaseLoadId) {
      const properties = envelope.data.baseData?.properties
      // eslint-disable-next-line no-param-reassign
      envelope.data.baseData ??= {}
      // eslint-disable-next-line no-param-reassign
      envelope.data.baseData.properties = {
        username,
        activeCaseLoadId,
        ...properties,
      }
    }
  }
  return true
}

export function buildAppInsightsClient(
  { applicationName, buildNumber }: ApplicationInfo,
  overrideName?: string,
): TelemetryClient | null {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    defaultClient.context.tags['ai.cloud.role'] = overrideName || applicationName
    defaultClient.context.tags['ai.application.ver'] = buildNumber

    defaultClient.addTelemetryProcessor(({ data }) => {
      const { url } = data.baseData!
      return !url?.endsWith('/health') && !url?.endsWith('/ping') && !url?.endsWith('/metrics')
    })

    defaultClient.addTelemetryProcessor(addUserDataToRequests)

    defaultClient.addTelemetryProcessor(({ tags, data }, contextObjects) => {
      if (contextObjects && data?.baseData) {
        const { correlationContext } = contextObjects!
        const operationNameOverride = correlationContext?.customProperties?.getProperty('operationName')
        if (operationNameOverride) {
          // eslint-disable-next-line no-param-reassign,no-multi-assign
          tags['ai.operation.name'] = data.baseData.name = operationNameOverride
        }
      }
      return true
    })

    return defaultClient
  }
  return null
}

export function ignoredRequestsProcessor(envelope: EnvelopeTelemetry) {
  if (envelope.data.baseType === Contracts.TelemetryTypeString.Request) {
    const requestData = envelope.data.baseData
    if (requestData instanceof Contracts.RequestData && requestData.success) {
      const { name } = requestData
      return requestPrefixesToIgnore.every(prefix => !name.startsWith(prefix))
    }
  }
  return true
}

export function ignoredDependenciesProcessor(envelope: EnvelopeTelemetry) {
  if (envelope.data.baseType === Contracts.TelemetryTypeString.Dependency) {
    const dependencyData = envelope.data.baseData
    if (dependencyData instanceof Contracts.RemoteDependencyData && dependencyData.success) {
      const { target } = dependencyData
      return dependencyPrefixesToIgnore.every(prefix => !target.startsWith(prefix))
    }
  }
  return true
}

export function appInsightsMiddleware(): RequestHandler {
  return (req, res, next) => {
    res.prependOnceListener('finish', () => {
      const context = getCorrelationContext()
      if (context && req.route) {
        context.customProperties.setProperty('operationName', `${req.method} ${req.route?.path}`)
        context.customProperties.setProperty('operationId', v4())
      }
    })
    next()
  }
}
