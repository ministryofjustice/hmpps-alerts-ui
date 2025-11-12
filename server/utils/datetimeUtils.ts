import { z } from 'zod/v3'
import { addDays, subDays } from 'date-fns'

const DATE_FORMAT_GB = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const DATE_FORMAT_GB_VERBOSE = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
})

const DATE_TIME_FORMAT_GB_VERBOSE = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
})

const RESULT_VALIDATOR = z.string().min(1)

const parseNumber = (value: string, min: number, max: number, length: number) => {
  const result =
    Number.isNaN(Number(value)) || Number(value) < min || Number(value) > max || value.length > length
      ? null
      : value.padStart(length, '0')
  return RESULT_VALIDATOR.safeParse(result)
}

export const parse24Hour = (value: string) => parseNumber(value, 0, 23, 2)

export const parseMinute = (value: string) => parseNumber(value, 0, 59, 2)

// format ISO Date into GB date string
export const formatInputDate = (value?: string) => value && DATE_FORMAT_GB.format(new Date(Date.parse(value)))

export const formatDisplayDate = (value?: string) => value && DATE_FORMAT_GB_VERBOSE.format(new Date(Date.parse(value)))

export const formatDisplayDateTime = (value?: string) =>
  value && DATE_TIME_FORMAT_GB_VERBOSE.format(new Date(Date.parse(value)))

// format HH:mm time into separate input field values HH and mm
export const formatInputTime = (value?: string | null) => {
  if (!value || value.length !== 8) {
    return [null, null]
  }
  return [value.substring(0, 2), value.substring(3, 5)]
}

export const todayString = () => new Date().toISOString().substring(0, 10)

export const todayStringGBFormat = () => DATE_FORMAT_GB.format(new Date())

export const pastDateStringGBFormat = (daysBeforeNow: number) =>
  DATE_FORMAT_GB.format(subDays(new Date(), daysBeforeNow))

export const futureDateStringGBFormat = (daysAfterNow: number) =>
  DATE_FORMAT_GB.format(addDays(new Date(), daysAfterNow))
