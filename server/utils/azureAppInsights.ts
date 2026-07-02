import {
  flushTelemetry,
  initialiseTelemetry,
  SpanKind,
  SpanModifierFn,
  telemetry,
} from '@ministryofjustice/hmpps-azure-telemetry'

initialiseTelemetry({
  serviceName: 'hmpps-alerts-ui',
  serviceVersion: process.env.BUILD_NUMBER || 'unknown',
  connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
  debug: process.env.DEBUG_TELEMETRY === 'true',
})
  .addFilter(telemetry.processors.filterSpanWherePath(['/health', '/ping', '/info', '/assets/*', '/favicon.ico']))
  .addModifier(ensureHttpRouteIsSet())
  .addModifier(telemetry.processors.enrichSpanNameWithHttpRoute())
  .startRecording()

/**
 * Fix for when nested routes can't resolve the full path
 */
function ensureHttpRouteIsSet(): SpanModifierFn {
  const prisonerNumberPattern = /\b[A-Z]\d{4}[A-Z]{2}\b/g
  const uuidPattern = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi

  const parameterise = (value: string) =>
    value //
      ?.replace(prisonerNumberPattern, ':prisonerNumber')
      ?.replace(uuidPattern, ':id')

  return span => {
    if (span.kind === SpanKind.SERVER && !span.attributes['http.route']) {
      const parameterisedUrl = parameterise(span.attributes['http.target'] as string)
      span.setAttribute('http.route', parameterisedUrl)
    }
  }
}

const shutdown = async () => {
  await flushTelemetry()
  process.exit(0)
}

process.on('SIGTERM', () => shutdown())
process.on('SIGINT', () => shutdown())
