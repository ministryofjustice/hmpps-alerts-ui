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

  async logAuditEvent(
    journeyData: Partial<JourneyData>,
    auditEvent: Omit<Response['locals']['auditEvent'], 'pageNameSuffix'>,
    what: string,
    query?: Request['query'],
  ) {
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
      ...auditEvent,
      ...(query ? { details: query } : {}),
      ...(typeOrCode ? { subjectId: typeOrCode } : {}),
      ...(typeOrCode ? { subjectType: typeOrCode } : {}),
      what,
      details: {
        ...auditEvent?.details,
        ...(codeFromRefData && { alertCode: codeFromRefData }),
        ...(typeFromRefData && { alertType: typeFromRefData }),
        ...(journeyData?.refData?.alertDescription && { alertDescription: journeyData?.refData?.alertDescription }),
        ...(journeyData?.refData?.alertTypeDescription && {
          alertTypeDescription: journeyData?.refData?.alertTypeDescription,
        }),
        ...(journeyData?.updateRefData?.changeType && { changeType: journeyData?.updateRefData?.changeType }),
      },
    }
    await this.hmppsAuditClient.sendMessage(event)
  }

  async logPageView(
    journeyData: Partial<JourneyData>,
    query: Request['query'],
    auditEvent: Response['locals']['auditEvent'],
    pagePrefix: string = '',
  ) {
    const { pageNameSuffix, ...auditEventProperties } = auditEvent
    await this.logAuditEvent(journeyData, auditEventProperties, `PAGE_VIEW_${pagePrefix + pageNameSuffix}`, query)
  }

  async logModificationApiCall(
    auditType: 'ATTEMPT' | 'SUCCESS',
    modificationType: 'CREATE' | 'UPDATE',
    requestUrl: string,
    journeyData: Partial<JourneyData>,
    auditEvent: Response['locals']['auditEvent'],
  ) {
    const pageName = requestUrl.replace(/\?.*/, '').split('/').slice(2).join('/').replace('/', '_').replace('-', '_')
    await this.logAuditEvent(journeyData, auditEvent, `${auditType}_${modificationType}_${pageName}`)
  }
}
