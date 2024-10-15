interface SelectOption {
  text: string
  value: string | number
  selected?: boolean
  attributes?:
    | {
        hidden?: 'hidden'
        disabled?: 'disabled'
      }
    | undefined
}

export const addDefaultSelectedValue = (
  items: SelectOption[],
  text: string,
  setHidden = true,
): SelectOption[] | null => {
  if (!items) return null

  return [
    {
      text,
      value: '',
      selected: true,
      attributes: setHidden ? { hidden: 'hidden' } : undefined,
    },
    ...items,
  ]
}

export const setSelected = (items: { value: string; text: string }[], selected?: string) =>
  items &&
  items.map(entry => ({
    ...entry,
    selected: entry && String(entry.value) === selected,
  }))
