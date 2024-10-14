import { format, isValid, parse } from 'date-fns'

const uniformWhitespace = (word: string): string => (word ? word.trim().replace(/\s+/g, ' ') : '')

export const sentenceCase = (word: string): string => {
  const uniformWhitespaceWord = uniformWhitespace(word)
  return uniformWhitespaceWord.trim().length >= 1
    ? uniformWhitespaceWord[0]!.toUpperCase() + uniformWhitespaceWord.toLowerCase().slice(1)
    : ''
}

export const nameCase = (name: string): string => {
  const uniformWhitespaceName = uniformWhitespace(name)
  return uniformWhitespaceName
    .split(' ')
    .map(s => (s.includes('-') ? s.split('-').map(sentenceCase).join('-') : sentenceCase(s)))
    .join(' ')
}

export const firstNameSpaceLastName = (person: { firstName: string; lastName: string }): string => {
  return `${nameCase(person.firstName)} ${nameCase(person.lastName)}`.trim()
}

export const lastNameCommaFirstName = (person: { firstName: string; lastName: string }): string => {
  return `${nameCase(person.lastName)}, ${nameCase(person.firstName)}`.replace(/(^, )|(, $)/, '')
}

export const dayMonthYearForwardSlashSeparator = (dateString: string): string => {
  if (!dateString) return ''
  const date = parse(dateString, 'yyyy-MM-dd', new Date())
  return date && isValid(date) ? format(date, 'dd/MM/yyyy') : dateString
}

export const personProfileName = (person: { firstName: string; lastName: string }): string =>
  lastNameCommaFirstName(person)

export const personDateOfBirth = (dateOfBirth: string): string => dayMonthYearForwardSlashSeparator(dateOfBirth)

export const personStatus = (status: string): string => sentenceCase(status)
