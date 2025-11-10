function initDynamicDropdowns() {
  const alertTypeElement = document.getElementById('alertType')
  const alertCodeElement = document.getElementById('alertCode')
  const descriptionGroupElement = document.getElementById('description')?.parentElement
  const typeCodeMap = JSON.parse(document.getElementById('typeCodeMap').textContent)

  if (descriptionGroupElement) {
    document.addEventListener('DOMContentLoaded', event => {
      descriptionGroupElement.hidden = alertCodeElement.value === 'DOCGM'
    })

    alertCodeElement.addEventListener('change', async () => {
      descriptionGroupElement.hidden = alertCodeElement.value === 'DOCGM'
    })
  }

  alertTypeElement.addEventListener('change', async () => {
    alertCodeElement.length = 1

    if (alertTypeElement.value === '') return

    typeCodeMap[alertTypeElement.value]?.forEach(alertCode => {
      const opt = new Option(alertCode.text, alertCode.value)
      opt.disabled = alertCode.attributes?.disabled
      alertCodeElement.add(opt)
    })
  })
}

initDynamicDropdowns()
