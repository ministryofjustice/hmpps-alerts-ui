import { components } from './index'

export type Alert = components['schemas']['Alert']
export type AlertType = components['schemas']['AlertType']
export type AlertCode = components['schemas']['AlertCode']
export type PageAlert = components['schemas']['PageAlert']
export type CreateAlertTypeRequest = components['schemas']['CreateAlertTypeRequest']
export type CreateAlertCodeRequest = components['schemas']['CreateAlertCodeRequest']
export type UpdateAlertTypeRequest = components['schemas']['UpdateAlertTypeRequest']
export type UpdateAlertCodeRequest = components['schemas']['UpdateAlertCodeRequest']
export type CreateAlertRequest = components['schemas']['CreateAlert']
export type BulkPlan = components['schemas']['BulkPlan']
export type BulkPlanPrisoners = components['schemas']['BulkPlanPrisoners']
export type BulkPlanAffect = components['schemas']['BulkPlanAffect']
export type BulkPlanStatus = components['schemas']['BulkPlanStatus']
export type BulkAlertPlanRequest = Partial<{
  alertCode: string
  description: string
  cleanupMode: 'KEEP_ALL' | 'EXPIRE_FOR_PRISON_NUMBERS_NOT_SPECIFIED'
}>
