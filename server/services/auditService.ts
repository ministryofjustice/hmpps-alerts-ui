import { Request, Response } from 'express'
import HmppsAuditClient, { AuditEvent } from '../data/hmppsAuditClient'
import { JourneyData } from '../@types/express'

export enum Page {
  EXAMPLE_PAGE = 'EXAMPLE_PAGE',
}

export interface PageViewEventDetails {
  who: string
  subjectId?: string
  subjectType?: string
  correlationId?: string
  details?: object
}

export default class AuditService {
  constructor(private readonly hmppsAuditClient: HmppsAuditClient) {}

  async logAuditEvent(event: AuditEvent) {
    await this.hmppsAuditClient.sendMessage(event)
  }

  async logPageView(
    journeyData: Partial<JourneyData>,
    query: Request['query'],
    auditEvent: Response['locals']['auditEvent'],
    pagePrefix: string = '',
  ) {
    const { pageNameSuffix, ...auditEventProperties } = auditEvent

    const codeFromRefData =
      journeyData?.refData?.alertCode ||
      journeyData?.refData?.deactivateAlertCode ||
      journeyData?.refData?.reactivateAlertCode
    const typeFromRefData =
      journeyData?.refData?.alertTypeCode ||
      journeyData?.refData?.deactivateAlertType ||
      journeyData?.refData?.deactivateAlertTypeCode ||
      journeyData?.refData?.reactivateAlertType ||
      journeyData?.refData?.updateAlertTypeCode

    const typeOrCode = codeFromRefData || typeFromRefData

    const event: AuditEvent = {
      ...auditEventProperties,
      ...(query ? { details: query } : {}),
      ...(typeOrCode ? { subjectId: typeOrCode } : {}),
      ...(typeOrCode ? { subjectType: typeOrCode } : {}),
      what: `PAGE_VIEW_${pagePrefix + pageNameSuffix}`,
      details: {
        ...auditEvent.details,
        ...(codeFromRefData && { alertCode: codeFromRefData }),
        ...(typeFromRefData && { alertType: typeFromRefData }),
        ...(journeyData?.refData?.alertDescription && { alertDescription: journeyData?.refData?.alertDescription }),
        ...(journeyData?.refData?.alertTypeDescription && {
          alertTypeDescription: journeyData?.refData?.alertTypeDescription,
        }),
      },
    }
    await this.hmppsAuditClient.sendMessage(event)
  }
}
