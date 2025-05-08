import { Prisoner } from '../data/prisonerSearchApiClient'

const properCase = (word: string): string =>
  word.length >= 1 ? word[0]!.toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string | null): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string | null): string =>
  !sentence || isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string | null): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0]![0]}. ${array.reverse()[0]}`
}

export const getNonUndefinedProp = <T>(referral: T, key: keyof T, mapper?: (obj: unknown) => string | null) => {
  if (referral[key] !== undefined) {
    return { [key]: mapper ? mapper(referral[key]) : referral[key] }
  }
  return {}
}

/**
 * Converts a user object containing firstName & lastName to a "firstName lastName" string.
 * @param user user to extract full name from
 * @returns name string
 */
export const firstNameLastName = (user?: { firstName: string; lastName: string }): string | null => {
  if (!user) return null
  return `${user.firstName} ${user.lastName}`
}

/**
 * Converts a prisoner name from 'firstName lastName' format to
 * "lastName, firstName" and bolds prisoner lastName
 */
export const prisonerName = (name: string, boldLastName = true) => {
  if (!name) return null
  const nameParts = name.trim().split(' ')
  const firstNames = nameParts.slice(0, nameParts.length - 1)

  let formattedName = nameParts[nameParts.length - 1]
  if (boldLastName) formattedName = `<strong>${formattedName}</strong>`
  formattedName += `, ${firstNames.join(' ')}`
  return formattedName?.trim()
}

/**
 * filter out unnecessary properties from the Prisoner objects, to reduce session storage size
 * @param Prisoner raw Prisoner object from API calls
 * @returns summarised Prisoner object with only properties used by hmpps-alerts-ui
 */
export const summarisePrisoner = ({ prisonerNumber, firstName, lastName, cellLocation, prisonId }: Prisoner) => ({
  prisonerNumber,
  firstName,
  lastName,
  cellLocation,
  prisonId,
})

export const sleep = (seconds: number) =>
  new Promise(resolve => {
    setTimeout(resolve, seconds * 1000)
  })

export const escapeHtml = (unsafe: string) => {
  return unsafe
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
