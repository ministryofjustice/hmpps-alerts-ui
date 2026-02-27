import type { SelectOption } from '../../server/utils/viewUtils'

const alertTypeElement = document.getElementById('alertType') as HTMLSelectElement | undefined
const alertCodeElement = document.getElementById('alertCode') as HTMLSelectElement | undefined
const descriptionGroupElement = document.getElementById('description')?.parentElement
const typeCodeMap: Record<string, SelectOption[]> = JSON.parse(
  document.getElementById('typeCodeMap')?.textContent ?? '{}',
)

if (alertCodeElement && descriptionGroupElement) {
  document.addEventListener('DOMContentLoaded', () => {
    descriptionGroupElement.hidden = alertCodeElement.value === 'DOCGM'
  })

  alertCodeElement.addEventListener('change', () => {
    descriptionGroupElement.hidden = alertCodeElement.value === 'DOCGM'
  })
}

if (alertTypeElement && alertCodeElement) {
  alertTypeElement.addEventListener('change', () => {
    alertCodeElement.length = 1

    if (alertTypeElement.value === '') return

    typeCodeMap[alertTypeElement.value]?.forEach(alertCode => {
      const opt = new Option(alertCode.text, alertCode.value as string)
      opt.disabled = alertCode.attributes?.disabled === 'disabled'
      alertCodeElement.add(opt)
    })
  })
}
